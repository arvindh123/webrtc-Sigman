import LZString from 'lz-string';
import GetRandomTheme from "../utils/GetRandomTheme"
import uuid from "uuid";

export default class RtcPc {

    constructor(iceServer = null , localMedia, debug = false) {
        
        this.Id = localMedia.id;
        this.Name = localMedia.name;
        this.iceServer = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
        this.mediaStream = localMedia.media;
        this.pc = null;
        this.debug = debug;
        this.localSdp = null 
        this.remoteEvent = null;
        this.remoteStream = null ;
        this.iceCandidates = [] ;
        this.iceCandidateComplete = false

        this.setLocalDescription = this.setLocalDescription.bind(this);
        this.setRemoteDescription = this.setRemoteDescription.bind(this);

        this.handleCreateOfferError = this.handleCreateOfferError.bind(this);
        this.handleCreateAnswerError = this.handleCreateAnswerError.bind(this);
        
        
        this.handleRemoteStreamAdded = this.handleRemoteStreamAdded.bind(this);
        this.handleRemoteStreamAddedWithResolve= this.handleRemoteStreamAddedWithResolve.bind(this);

        this.handleRemoteStreamRemoved = this.handleRemoteStreamRemoved.bind(this)
        
        this.handleIceCandidate = this.handleIceCandidate.bind(this)
        
        this.addIceCandidates = this.addIceCandidates.bind(this);

        this.addStream = this.addStream.bind(this);
        this.GenerateCall = this.GenerateCall.bind(this);
        this.GenerateAnswer= this.GenerateAnswer.bind(this)

    }

    // Step - 1 Create Peer Connection 
    createPeerConnection(iceCandidateFinishedResolve) {
        try {
            this.pc = new RTCPeerConnection(this.iceServer);
            this.pc.onicecandidate = (event) => this.handleIceCandidate(event,iceCandidateFinishedResolve);
            this.pc.onaddstream = this.handleRemoteStreamAdded;
            this.pc.onremovestream = this.handleRemoteStreamRemoved;
            console.log('Created RTCPeerConnnection');
        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            alert('Cannot create RTCPeerConnection object.');
            return;
        }
    }


    // Step - 2 Add stream to peer connection 
    async addStream() {
        await this.pc.addStream(this.mediaStream);
        console.log('added Local stream to the peer connection - localstream - ', this.localStream);
    }


    // Step - 3  If caller - Create offer 
    async createdOffer() {
        console.log("creating offer")
        await this.pc.createOffer().then(this.setLocalDescription,this.handleCreateOfferError);
    }

    // Step - 4    If recevier - Create offer or CreateAnswer
    async createAnswer() {
        console.log('Sending answer to peer.');
        await this.pc.createAnswer().then( this.setLocalDescription,  this.handleCreateAnswerError);
    }

    // Step -3 If recevier - set Remote desritpion,
    // Step - 5 if caller -  set Remote desritpion,
    async setRemoteDescription(remoteDescription) {
        console.log(remoteDescription)
        await this.pc.setRemoteDescription(new RTCSessionDescription(remoteDescription));
    }



    // Step -4 If recevier - set Remote desritpion,
    // Step - 6 if caller -  set Remote desritpion,
    async addIceCandidates(iceCandidates) {
        console.log("receiverSetCallerIceCand  iceCandidateOfCaller-", iceCandidates)
        await iceCandidates.forEach((item) => {
            try {
                console.log(item)
                 this.pc.addIceCandidate(item);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        })
    }


    stop() {
        this.pc.close();
    }


    // Call the call back and support function 
    handleIceCandidate(event,iceCandidateFinishedResolve) {
        // console.log("message - ", message)
        console.log('icecandidate event: ', event);
        if (event.candidate) {
            this.iceCandidates.push(event.candidate)
        } else {
            console.log('End of candidates.');
            iceCandidateFinishedResolve(true)
        }
    }

    handleRemoteStreamAdded(event) {
        console.log('Remote stream added.');
        console.log(event)
        this.remoteEvent = event;
        this.remoteStream = event.stream;
    }
    handleRemoteStreamAddedWithResolve(event, resolve) {
        console.log('Remote stream added.');
        console.log(event)
        this.remoteEvent = event;
        this.remoteStream = event.stream;
        resolve(true)
    }

    handleRemoteStreamRemoved(event) {
        console.log('Remote stream removed. Event: ', event);
    }

    setLocalDescription(sessionDescription) {
        this.pc.setLocalDescription(sessionDescription);
        this.localSdp = sessionDescription
        console.log('Local- sessionDescription', sessionDescription);
    }   

    handleCreateOfferError(event) {
        console.log('createOffer() error: ', event);
    }

    handleCreateAnswerError(error) {
        console.log('Failed to create Answer description: ' + error.toString());
    }

    async GenerateCall() {

        let iceCandidateFinishedResolve ,iceCandidateFinishedReject
        let pack 
        const iceCandidateFinishedPromise =  new Promise( function(resolve, reject) { iceCandidateFinishedResolve = resolve ; iceCandidateFinishedReject = reject; } )

        this.createPeerConnection(iceCandidateFinishedResolve);
        await this.addStream();
        await this.createdOffer();
        let response = await iceCandidateFinishedPromise
        if (response === true) { 
            pack = { 
                callId :  uuid.v4(),
                callerId : this.Id,
                callerName: this.Name,
                callerSpd : this.localSdp,
                callerIce : this.iceCandidates
            }
        }
        let sentPackJson = JSON.stringify( {...pack, outside:true} );
        pack = { ...pack, outside:false, theme: GetRandomTheme()}
       return [ pack, LZString.compressToBase64(sentPackJson)]
    }

    async GenerateAnswer(pack) {
        let iceCandidateFinishedResolve ,iceCandidateFinishedReject
        let repack
        const iceCandidateFinishedPromise =  new Promise( function(resolve, reject) { iceCandidateFinishedResolve = resolve ; iceCandidateFinishedReject = reject; } )
        this.createPeerConnection(iceCandidateFinishedResolve);
        await this.addStream();
        await this.setRemoteDescription(pack.callerSpd) 
        await this.createAnswer();
        let response = await iceCandidateFinishedPromise
        if (response === true) { 
        repack = {
                ...pack,
                receiverId:this.Id,
                receiverName:this.Name,
                receiverSpd:this.localSdp,
                receiverIce:this.iceCandidates,
            }
        }

        await this.addIceCandidates(pack.callerIce)

        let sentRepackJson = JSON.stringify(repack)
        repack = { ...repack,  theme: GetRandomTheme()}
        return [ repack, LZString.compressToBase64(sentRepackJson)]

    }

}
