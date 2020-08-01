import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import VideoContent from './VideoContent';

const useStyles = makeStyles((theme, content) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatarColor: {
        color: (content) => content.theme.textColor,
        // color: theme.palette.getContrastText( (content) =>  content.color  ),

        backgroundColor: (content) => content.theme.backgroundColor,
    },

    expandOpen: {
        transform: 'rotate(180deg)',
    },

}));



const RemoteVideoCard = ({ HandleRemoveRemoteMedia, content }) => {
    const classes = useStyles(content);
    const getIntials = (name) => {
        if (typeof name ===  'undefined') {
            return "WaitingForResponse"
        }
        if (name.length <= 2)  {
            return name
        } else if (name.split(" ").length < 2) { 
            return name.substr(0,2).toUpperCase()
        } else {
            var initials = name.match(/\b\w/g) || [];
            return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
        }
    }
    let titleName = content.outside ? content.callerName : content.receiverName
    console.log("here =============>", content,titleName)
    return (
        <div>
            
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatarColor}  >
                            { getIntials(titleName) }
                        </Avatar>
                    }
                    title={titleName }
                    action={   <IconButton aria-label="settings" onClick={() => HandleRemoveRemoteMedia(content.id)} >
                                        <CloseIcon/>
                                </IconButton> }
                />
                <CardContent>
                    <VideoContent media={content.media}/>
                </CardContent>
            </Card>
        </div>
    );
}


export default RemoteVideoCard