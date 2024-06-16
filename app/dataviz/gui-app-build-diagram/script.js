function onWorkspaceMounted(workspace) {
    if (!workspace) { return; }
    workspace.getModel().importLayout({        
        dataProvider: new Ontodia.SparqlDataProvider({
            endpointUrl: 'https://data.europa.eu/sparql',
            imagePropertyUris: [                
                'http://xmlns.com/foaf/0.1/img',
            ],
            queryMethod: Ontodia.SparqlQueryMethod.GET
        }, Ontodia.OWLStatsSettings),
    });
}

ReactDOM.render(
    React.createElement(Ontodia.Workspace, {ref: onWorkspaceMounted}),
    document.getElementById('container')
);