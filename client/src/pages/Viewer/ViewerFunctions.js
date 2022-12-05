/* global Autodesk, THREE */
import Client from "../Auth";
import axios from "axios";

var getToken = {accessToken: Client.getAccesstoken()};
var viewer;

function launchViewer(div, urn){
    
    getToken.accessToken.then((token) => {
        
        var options = {
            'env': 'AutodeskProduction',
            'accessToken': token.access_token
        };

        Autodesk.Viewing.Initializer(options, function() {

            var htmlDiv = document.getElementById(div);
            viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);
            var startedCode = viewer.start();
            if (startedCode > 0) {
                console.error('Failed to create a Viewer: WebGL not supported.');
                return;
            }

            console.log('Initialization complete, loading a model next...');

        });

        var documentId = urn;
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);

        viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoaded);

        function onDocumentLoadSuccess(viewerDocument) {
            var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
            viewer.loadDocumentNode(viewerDocument, defaultModel);
        };
        
        function onDocumentLoadFailure() {
            console.error('Failed fetching Forge manifest');
        };

    })
};

function onGeometryLoaded(event){
    var viewer = event.target;

    viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoaded);
	viewer.fitToView();

    viewer.model.getExternalIdMapping((data) => {

        axios.get('/api/doors')
        .then((response) => {
            
            var doorInfo = new Map();

            for(var i in response.data){
                
                Object.keys(data).forEach((key) => {

                    if(key == response.data[i]._id){
                        doorInfo.set(data[key], response.data[i].DoorFinish);
                    }
                })
            };

            doorInfo.forEach((v, k) => {
                
                switch(v){
                    case 'Satin':
                        var blue = new THREE.Vector4(0, 0, 255, 1);
                        viewer.setThemingColor(k, blue);
                        break;
                    case 'Varnish':
                        var red = new THREE.Vector4(1, 0, 0, 1);
                        viewer.setThemingColor(k, red);
                        break;
                    case 'Veneer':
                        var yellow = new THREE.Vector4(255, 255, 0, 1);
                        viewer.setThemingColor(k, yellow);
                        break;
                    case 'Gloss':
                        var green = new THREE.Vector4(0, 255, 0, 1);
                        viewer.setThemingColor(k, green);
                        break;
                }
            })
        }).catch((error) => console.log(error));
    }, (err) => console.log(err));
};

export function getSelection(DoorFinish){

    const dbId = viewer.getSelection()[0];

    if(viewer.getSelectionCount() !== 1){
        alert("Select Door Element");
    }
    else if(viewer.getSelectionCount() > 0){
        
        viewer.model.getProperties(dbId, (item) => {

            var data = {
                "_id": `${item.externalId}`,
                "DoorFinish": DoorFinish
            };

            axios.patch('/api/doors/update', data)
            .then((response) => {
                alert("DoorFinish Value Updated");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            })
        });
    }
}

export default launchViewer;