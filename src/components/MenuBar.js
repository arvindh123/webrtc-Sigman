import React, { Component, useState, useEffect, useRef } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useRecoilState, useRecoilValue, readOnlySelector } from 'recoil';
import { RemoteMedia, LocalMedia } from '../recoil/atoms';
import uuid from "uuid";
import GetRandomTheme from "../utils/GetRandomTheme"
import RtcPc from "./RtcPc"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import LZString from 'lz-string';


const styles = theme => ({
    textField: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: 0,
        marginTop: 0,
        fontWeight: 500,
        background: 'white',
        color: 'white',
    },
    input: {
        color: 'white',
        background: 'white'
    }
})

const CAPTURE_OPTIONS = {
    audio: false,
    video: true,
};


const MenuBar = ({ handleAddRemoteMedia, }) => {

    const classes = styles();
    const [name, setName] = useState("me")
    const [toSendStr, setToSentStr] = useState("")
    const [recvStr, setRecvStr] = useState("")

    const [localMedias, setLocalMedia] = useRecoilState(LocalMedia);
    const [remoteMedias, setRemoteMedia] = useRecoilState(RemoteMedia);
    const [media, setMedia] = useState(null)



    const getMedia = async () => {
        const media = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        });
        setMedia(media);
    }

    const stopMedia = () => {
        if (media instanceof MediaStream) {
            media.getTracks().forEach(track => track.stop());
        }
        setMedia(null);
    }

    const HandleStartStopButton = () => {
        if (media instanceof MediaStream) {
            stopMedia();
        } else {

            getMedia();
        }
    }

    const HandleLocalMedia = () => {
        if (localMedias.length < 1) {
            let locMedia = {
                id: uuid.v4(),
                name,
                theme: GetRandomTheme(),
                media,
                local: true
            };
            setLocalMedia([locMedia]);

        } else {
            let temp = localMedias[0]
            setLocalMedia([{ ...temp, name, media }])
        }
        // console.log(localMedias)
    }

    useEffect(() => HandleLocalMedia(), [name, media])

    const generate = async (localMedias) => {
        if ((localMedias.length > 0) && (localMedias[0].media)) {
            console.log(localMedias[0].media.constructor.name)
            if (localMedias[0].media.constructor.name === "MediaStream") {
                let newPc = new RtcPc(null, localMedias[0], false)
                let [pack, sentPackCompStr] = await newPc.GenerateCall()
                setRemoteMedia([...remoteMedias, { ...pack, RtcPc: newPc, media: newPc.remoteStream }])
                setToSentStr(sentPackCompStr)
                console.log(pack, sentPackCompStr)
            } else {
                alert("Click Start and then click generate")
                console.log("Click Start and then click generate")
            }
        } else {
            alert("Click Start and then click generate")
            console.log("Click Start and then click generate")
        }
    }

    const HandleGenerateButton = () => {
        // useEffect(() => pc(localMedias), [localMedias])
        generate(localMedias)
        // alert("Click Start and then click generate")
    }

    const addbutton = async (localMedias, remoteMedias) => {
        let pack = JSON.parse(LZString.decompressFromBase64(recvStr))
        let notExecuteFull = true
        let tempAddRemoteStreamResolver
        let tempAddRemoteStreamPromise = new Promise((resolve, reject) => { tempAddRemoteStreamResolver = resolve })
        remoteMedias.forEach(async (remoteMedia, index) => {
            if (remoteMedia.callerId === pack.callerId) {
                notExecuteFull = false
                remoteMedia.RtcPc.pc.onaddstream = (event) => remoteMedia.RtcPc.handleRemoteStreamAddedWithResolve(event, tempAddRemoteStreamResolver);
                remoteMedia.RtcPc.setRemoteDescription(pack.receiverSpd)
                remoteMedia.RtcPc.addIceCandidates(pack.receiverIce)
                let temp1 = await tempAddRemoteStreamPromise
                if (temp1) {
                    remoteMedia = {
                        ...remoteMedia,
                        recevierId: pack.receiverId,
                        receiverName: pack.receiverName,
                        receiverIce: pack.receiverIce,
                        receiverSpd: pack.receiverSpd,
                        media: remoteMedia.RtcPc.remoteStream
                    }
                    remoteMedias[index] = remoteMedia;
                }
            }
        });
        if (notExecuteFull === false) {
            let temp1 = await tempAddRemoteStreamPromise
            if (temp1) {
                setRemoteMedia(remoteMedias)
            }
        }
        if (notExecuteFull === true) {
            if ((localMedias.length > 0) && (localMedias[0].media)) {
                if (localMedias[0].media.constructor.name === "MediaStream") {
                    let newPc = new RtcPc(null, localMedias[0], false)
                    const [repack, sentRepackCompStr] = await newPc.GenerateAnswer(pack)
                    setRemoteMedia([...remoteMedias, { ...repack, RtcPc: newPc, media: newPc.remoteStream }])
                    setToSentStr(sentRepackCompStr)
                    console.log(repack, sentRepackCompStr)
                }
                else {
                    alert("Click Start and then click Add")
                    console.log("Click Start and then click Add")
                }
            } else {
                alert("Click Start and then click Add")
                console.log("Click Start and then click Add")
            }
        }
        console.log("Final ..  ", remoteMedias)
    }

    const HandleAddButton = () => {
        addbutton(localMedias, remoteMedias)
    }

    return (
        <AppBar position='static'>
            <Toolbar>
                <Grid justify='space-between' container spacing={24}>
                    <Grid item justify='center' alignItems='center'>
                        <Button variant='contained' onClick={() => HandleStartStopButton()} > {media ? "Stop" : "Start"}  </Button>
                        <TextField
                            id="name"
                            variant="filled"
                            label="Name"
                            className={classes.textField}
                            onChange={(e) => setName(e.target.value)}
                            // defaultValue="M E"
                            placeholder="Enter your name"
                            InputProps={{
                                className: classes.input,
                            }}
                        />
                        <Button variant='contained' onClick={() => HandleGenerateButton()}>Generate </Button>
                        <TextareaAutosize
                            aria-label='minimum height'
                            rowsMin={3}
                            rowsMax={4}
                            placeholder=''
                            value={toSendStr}
                        />
                        <CopyToClipboard text={toSendStr}>
                            <Button variant='contained'>Copy </Button>
                        </CopyToClipboard>
                    </Grid>
                    <Grid item justify='center' alignItems='center'>
                        <TextareaAutosize
                            aria-label='minimum height'
                            rowsMin={3}
                            rowsMax={4}
                            placeholder='Paste here'
                            onChange={(e) => { setRecvStr(e.target.value); console.log(recvStr) }}
                            value={recvStr}
                        />
                        <Button variant='contained' onClick={() => { console.log(recvStr); HandleAddButton() }}  >Add </Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar >
    )

}

export default MenuBar