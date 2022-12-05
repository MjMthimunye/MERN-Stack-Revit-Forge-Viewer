import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, FormControl, Select, Dialog,
    MenuItem, DialogTitle, DialogContentText, DialogContent, DialogActions, InputLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Viewer from './Viewer/Viewer';
import { getSelection } from './Viewer/ViewerFunctions';

class Home extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            open: false,
            DoorFinish: "Satin"
        };
    };

    handleClose = () => {
        this.setState({
            open: false
        })
    };

    handleChange = (event) => {
        this.setState({
            DoorFinish: event.target.value
        })
    };

    handleClickOpen = () => {
        this.setState({
            open: true
        })
    };

    render(){

        const {DoorFinish, open} = this.state;

        return(
            <div className='viewer-home'>
                 <AppBar position="static" style={{marginBottom: 25}}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Jacobian Dev
                        </Typography>
                        <Button color="inherit" onClick={this.handleClickOpen}>Update</Button>
                    </Toolbar>
                </AppBar>

                <Viewer/>

                <Dialog
                    open={open}
                    onClose={this.handleClose}
                >
                <DialogTitle>Door Finish Update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please select door finish value.
                    </DialogContentText>
                    <FormControl sx={{ m: 2, minWidth: 200 }} size="small">
                    <InputLabel>Door Finish</InputLabel>
                    <Select
                        value={DoorFinish}
                        label="Door Finish"
                        onChange={this.handleChange}
                    >
                        <MenuItem value="Satin">Satin</MenuItem>
                        <MenuItem value="Varnish">Varnish</MenuItem>
                        <MenuItem value="Veneer">Veneer</MenuItem>
                        <MenuItem value="Gloss">Gloss</MenuItem>
                    </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>Cancel</Button>
                    <Button onClick={() => getSelection(DoorFinish)}>Save</Button>
                </DialogActions>
            </Dialog>
            </div>
        )
    }
};

export default Home;