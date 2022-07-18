const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();

async function runQueryCandi() {
    const bindingsStream = await myEngine.queryBindings(`
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX candi: <http://alunalun.info/ontology/candi#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?s ?c ?g ?n
    WHERE {
      {
          ?s rdf:type owl:NamedIndividual .
          ?s rdf:type candi:CandiNonKeagamaan .
          ?s rdfs:label ?n .
          OPTIONAL { ?s candi:linkGambar1 ?g }
      } UNION 
      {
          ?s rdf:type owl:NamedIndividual .
            ?s rdf:type ?c .
            ?c rdfs:subClassOf candi:CandiKeagamaan .
            ?s rdfs:label ?n .
            OPTIONAL { ?s candi:linkGambar1 ?g }
      }
    }`, {
        sources: [{
            value: 'https://app.alunalun.info/fuseki/candi#',
        }],
        });

    bindingsStream.on('data', (binding) => {
        // console.log(binding.toString()); // Quick way to print bindings for testing

        // console.log(binding.has('s')); // Will be true
        // console.log(binding.has('c'));
        
        // Obtaining values
        console.log('Label: ' + binding.get('n').value);
        console.log('s: ' + binding.get('s').value);
        
        if(binding.has('c')){
            console.log('c: ' + binding.get('c').value);
        }
        if(binding.has('g')){
            console.log('g: ' + binding.get('g').value);
        }

        // console.log(binding.get('g').value);
        // console.log(binding.get('s').termType);
    });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

    const bindings = await bindingsStream.toArray();

    console.log(bindings[0].get('s').value);
    
}

async function runQueryAlatMusik() {
    const bindingsStream = await myEngine.queryBindings(`
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX alat: <http://alunalun.info/ontology/alatmusik#>
    PREFIX schema: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?s ?c ?n ?img
    WHERE {
        ?s rdf:type owl:NamedIndividual .
        ?s rdf:type ?c .
        ?s rdfs:label ?n .
        ?c rdfs:subClassOf alat:Category .
        OPTIONAL { 
        ?s schema:image ?g . 
        BIND(CONCAT('http://app.alunalun.info/repo/images/alatmusik', STR(?g)) as ?img)
        }
    }`, {
        sources: [{
            value: 'https://app.alunalun.info/fuseki/alatmusik#',
        }],
        });

    bindingsStream.on('data', (binding) => {
        // console.log(binding.toString()); // Quick way to print bindings for testing

        // console.log(binding.has('s')); // Will be true
        // console.log(binding.has('c'));
        
        // Obtaining values
        console.log('Label: ' + binding.get('n').value);
        console.log('s: ' + binding.get('s').value);
        console.log('c: ' + binding.get('c').value);
        
        if(binding.has('img')){
            console.log('Gambar: ' + binding.get('img').value);
        }

        // console.log(binding.get('g').value);
        // console.log(binding.get('s').termType);
    });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

    const bindings = await bindingsStream.toArray();

    console.log(bindings[0].get('s').value);
    
}

async function runQueryBatik() {
    var data = new Array();
    const bindingsStream = await myEngine.queryBindings(`
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX batik: <http://alunalun.info/batik#>
    PREFIX schema: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?s ?d ?c ?n ?img ?category
    WHERE {
    {
        ?s rdfs:subClassOf ?c .
        ?c rdfs:subClassOf batik:NonGeometris .
        BIND('NonGeometris' as ?category) .
        ?s rdfs:label ?n .
        OPTIONAL { 
        ?s schema:image ?g . 
        BIND(CONCAT('http://app.alunalun.info/repo/images/batik', STR(?g)) as ?img)
        }
    } UNION {
        ?s rdfs:subClassOf ?d .
        ?d rdfs:subClassOf ?c .
        ?c rdfs:subClassOf batik:Geometris .
        BIND('Geometris' as ?category) .
        ?s rdfs:label ?n .
        OPTIONAL { 
            ?s schema:image ?g . 
            BIND(CONCAT('http://app.alunalun.info/repo/images/batik', STR(?g)) as ?img)
        }
        }
    }`, {
        sources: [{
            value: 'https://app.alunalun.info/fuseki/batik#',
        }],
        });

    bindingsStream.on('data', (binding) => {
        //console.log(binding.toString()); // Quick way to print bindings for testing

        // console.log(binding.has('s')); // Will be true
        // console.log(binding.has('c'));
        
        // Obtaining values
        // console.log('Label: ' + binding.get('n').value);
        // console.log('s: ' + binding.get('s').value);
        // console.log('c: ' + binding.get('c').value);
        // console.log('Category: ' + binding.get('category').value);
        
        // if(binding.has('img')){
        //     console.log('Gambar: ' + binding.get('img').value);
        // }
        // if(binding.has('d')){
        //     console.log('d: ' + binding.get('d').value)
        // }
        data.push(JSON.parse(binding.toString()));
        
        //console.log(binding);
        // console.log(binding.get('g').value);
        // console.log(binding.get('s').termType);
    });

    bindingsStream.on('end', () => {
        
    data.forEach((element) => {
        console.log(element);
    });
    
        // The data-listener will not be called anymore once we get here.
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

    //const bindings = await bindingsStream.toArray();

}


async function runQueryKerajinan() {
    var data = new Array();
    const bindingsStream = await myEngine.queryBindings(`
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX kerajinan: <http://alunalun.info/ontology/kerajinan#>
    PREFIX schema: <http://schema.org/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?s ?n ?g ?category

    WHERE{
    {
        ?s rdf:type owl:NamedIndividual .
        ?s rdf:type kerajinan:KerajinanKayu .
    BIND('Kerajinan Kayu' as ?category) .
        ?s rdfs:label ?n .
    OPTIONAL{?s schema:image ?g .}
    }UNION {
        ?s rdf:type owl:NamedIndividual .
        ?s rdf:type kerajinan:Anyaman .
    BIND('Anyaman' as ?category) .
        ?s rdfs:label ?n .
    OPTIONAL{?s schema:image ?g .}
    }
    } `, {
        sources: [{
            value: 'https://app.alunalun.info/fuseki/kerajinantradisional#',
        }],
        });

    bindingsStream.on('data', (binding) => {
        //console.log(binding.toString()); // Quick way to print bindings for testing

        // console.log(binding.has('s')); // Will be true
        // console.log(binding.has('c'));
        
        // Obtaining values
        // console.log('Label: ' + binding.get('n').value);
        // console.log('s: ' + binding.get('s').value);
        // console.log('c: ' + binding.get('c').value);
        // console.log('Category: ' + binding.get('category').value);
        
        // if(binding.has('img')){
        //     console.log('Gambar: ' + binding.get('img').value);
        // }
        // if(binding.has('d')){
        //     console.log('d: ' + binding.get('d').value)
        // }
        
        data.push(JSON.parse(binding.toString()));
        
        
        //console.log(binding);
        // console.log(binding.get('g').value);
        // console.log(binding.get('s').termType);
    });

    bindingsStream.on('end', () => {
        
    data.forEach((element) => {
        console.log(element);
    });
    
        // The data-listener will not be called anymore once we get here.
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });
}





// runQueryCandi()
// runQueryAlatMusik()
//runQueryBatik()
runQueryKerajinan()

