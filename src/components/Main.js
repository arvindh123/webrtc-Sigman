import React from 'react';
import VideoCard from './VideoCard';
import LocalVideoCard from './LocalVideoCard';
import RemoteVideoCard from './RemoteVideoCard';
import Grid from '@material-ui/core/Grid';
import MenuBar from './MenuBar'
import { useRecoilState, useRecoilValue , useState} from 'recoil';
import { RemoteMedia, LocalMedia } from '../recoil/atoms';
import uuid from "uuid";
import GetRandomTheme from "../utils/GetRandomTheme"


const ret_rand = () => {
    return { id: uuid.v4(), name: "Test Name", theme: GetRandomTheme() }
}

export default function VideoContent() {
    // const [spacing, setSpacing] = useState(5);
    const [remoteMedias, setRemoteMedia] = useRecoilState(RemoteMedia);
    const [localMedias, setLocalMedia] = useRecoilState(LocalMedia);


    const HandleRemoveRemoteMedia = (id) => {
        setRemoteMedia((remoteMedias) => remoteMedias.filter(remoteMedia => remoteMedia.id !== id));
    };
    const HandleRemoveLocalMedia = (id) => {
        setLocalMedia((localMedias) => localMedias.filter(localMedia => localMedia.id !== id));
    };
    

    return (
        <div>
            <MenuBar handleAddRemoteMedia={() => setRemoteMedia([...remoteMedias, ret_rand()])} />
            <div style={{ padding: 30 }}>
                <Grid
                    mt={10}
                    container
                    spacing={12}
                    direction='row'
                    justify='center'
                    alignItems='center'
                >
                    {/* width="100%" height="100%" display="flex" justifyContent="center" alignContent="center" flexWrap="wrap" alignItems="center" */}
                    <Grid
                        item
                        xs={16}
                        md={18}
                        direction='row'
                        justify='center'
                        alignItems='center'
                    >
                        <Grid
                            container
                            direction='row'
                            justify='center'
                            alignItems='center'
                            spacing={12}
                        >
                            {localMedias.map((localMedia) => (
                                <Grid key={2} item>
                                    <LocalVideoCard
                                        id={localMedia.id}
                                        HandleRemoveRemoteMedia ={HandleRemoveLocalMedia}
                                        content={localMedia} 
                                    />
                                </Grid>
                            ))} 
                            
                            {remoteMedias.map((remoteMedia) => (
                                <Grid key={2} item>
                                    <RemoteVideoCard
                                        id={remoteMedia.callId}
                                        HandleRemoveRemoteMedia ={HandleRemoveRemoteMedia}
                                        content={remoteMedia} 
                                    />
                                </Grid>
                            ))}

                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}