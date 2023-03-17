function outsideTheContinent() //Retourne les pays avec au moins un pays frontalier en dehors de son continent
{
    let tableau_continent_different = [];
    let pays;
    let pays_frontalier;
    let indice_frontalier;
    let outside;
    for(let code_pays in Country.all_countries)
    {
        pays = Country.all_countries[code_pays];
        pays_frontalier = pays.getBorders();
        if(pays_frontalier !== undefined) //Si le pays possède des pays frontaliers
        {
            indice_frontalier = 0;
            outside = false;
            while((indice_frontalier < pays_frontalier.length) && !(outside))
            {
                if(pays["region"] !== pays_frontalier[indice_frontalier]["region"])
                {
                    tableau_continent_different.push(code_pays);
                    outside = true;
                }
                indice_frontalier++;
            }
        }
    }
    return tableau_continent_different;
}
console.log("#1-----------------------------------------------");
console.log("Pays avec au moins un pays frontalier en dehors de son continent : ");
console.log(outsideTheContinent());

function moreNeighbors() //Retourne le(s) pays avec le plus grand nombre de voisins
{
    let tableau_pays_max_voisin = [];
    let max = 0;
    for(let code_pays in Country.all_countries)
    {
        pays = Country.all_countries[code_pays];
        pays_frontalier = pays.getBorders();
        if(pays_frontalier !== undefined)
        {
            if(pays_frontalier.length > max)
            {
                tableau_pays_max_voisin = [];
                tableau_pays_max_voisin.push(code_pays);
                max = pays_frontalier.length;
            }
            else if(pays_frontalier.length === max)
            {
                tableau_pays_max_voisin.push(code_pays);
            }
        }
    }
    return tableau_pays_max_voisin;
}
console.log("#2-----------------------------------------------");
console.log("Les pays avec les plus grand nombre de voisins : ");
let pays_more_neighbors = moreNeighbors();
for(let code_pays of pays_more_neighbors)
{
    let neighbors = Country.all_countries[code_pays].getBorders().map((a) => a.alpha3Code);
    console.log("Pays : " + code_pays);
    console.log("Voisins : ");
    console.log(neighbors);
}


function neighborless() //Retourne les pays qui n'ont pas de voisins 
{
    let tableau_pays_pas_de_voisins = [];
    for(let code_pays in Country.all_countries)
    {
        if(Country.all_countries[code_pays]["borders"] === PAS_FRONTALIER)
        {
            tableau_pays_pas_de_voisins.push(code_pays);
        }
    }
    return tableau_pays_pas_de_voisins;
}
console.log("#3-----------------------------------------------");
console.log("Pays qui n'ont aucuns voisins : ");
console.log(neighborless());

function moreLanguages() //Retourne le(s) pays avec le plus grand nombre de langages 
{
    let tableau_pays_max_language = [];
    let max = 0;
    for(let code_pays in Country.all_countries)
    {
        pays = Country.all_countries[code_pays];
        pays_languages = pays.getLanguages();
        if(pays_languages !== undefined)
        {
            if(pays_languages.length > max)
            {
                tableau_pays_max_language = [];
                tableau_pays_max_language.push(code_pays);
                max = pays_languages.length;
            }
            else if(pays_languages.length === max)
            {
                tableau_pays_max_language.push(code_pays);
            }
        }
    }
    return tableau_pays_max_language;
}
console.log("#4-----------------------------------------------");
console.log("Le(s) pays qui ont le plus de langues : ");
let pays_more_languages = moreLanguages();
for(let code_pays of pays_more_languages)
{
    let languages = Country.all_countries[code_pays].getLanguages().map((a) => a.iso639_2);
    console.log("Pays : " + code_pays);
    console.log("Languages : ");
    console.log(languages);
}


function withCommonLanguage() //Retourne les pays ayant au moins un voisin parlant l'une de ses langues
{

    let pays_contient_meme_langues = [];

    let listCountries = Country.all_countries; // récupération de tous les pays

    let pays;
    let langues_pays;
    let list_pays_frontalier;
    for(let code_pays in listCountries) {

        pays = listCountries[code_pays];

        

        let resultatPays = {};
        resultatPays[pays.translations["en"]] = {};
        let langues_pays = [];
        for(let langue_pays of pays.getLanguages()) {
            langues_pays.push(langue_pays.name);
        }

        list_pays_frontalier = pays.getBorders();
    
        if(list_pays_frontalier !== undefined) {
            for(let pays_frontalier of list_pays_frontalier) {
                for(let langues_pays_frontalier of pays_frontalier.getLanguages()) {
                    if(langues_pays.includes(langues_pays_frontalier.name)) {
                        
                        
                        if(!resultatPays[pays.translations["en"]].hasOwnProperty(langues_pays_frontalier.name)) {
                            resultatPays[pays.translations["en"]][langues_pays_frontalier.name] = Array(pays_frontalier.translations["en"]);
                        } else {
                            resultatPays[pays.translations["en"]][langues_pays_frontalier.name].push(pays_frontalier.translations["en"]);
                        }
                    }
                }
            }
                        
        }

        if(Object.keys(resultatPays[pays.translations["en"]]).length > 0) {
            pays_contient_meme_langues.push(resultatPays);
        }
    }

    return pays_contient_meme_langues;
}
console.log("#5-----------------------------------------------");
console.log("Les pays ayant au moins un voisin parlant l’une de ses langues :");
console.log(withCommonLanguage());

function withoutCommonCurrency() //Retourne les pays qui ne partage pas ses monnaies avec ses voisins
{
    let tableau_no_common_monney = [];
    for(let code_pays in Country.all_countries)
    {
        let pays = Country.all_countries[code_pays];
        let pays_frontalier = pays.getBorders();
        let pays_monnaies = pays.getCurrencies();
        let indice_frontalier = 0;
        let common = false;
        while(indice_frontalier < pays_frontalier.length && !(common))
        {
            let pays_monnaie_frontalier = pays_frontalier[indice_frontalier].getCurrencies();
            let indice_monnaie = 0;
            while(indice_monnaie < pays_monnaie_frontalier.length && !(common))
            {
                if(pays_monnaies.includes(pays_monnaie_frontalier[indice_monnaie]))
                {
                    common = true;
                }
                indice_monnaie++;
            }
            indice_frontalier++;
        }
        if(!(common))
        {
            tableau_no_common_monney.push(code_pays);
        }
    }
    return tableau_no_common_monney;
}
console.log("#6-----------------------------------------------");
console.log("Le(s) pays qui ne partage pas ses monnaies avec les pays voisins : ");
console.log(withoutCommonCurrency());

function sortingDecreasingDensity() //Retourne les pays par ordre décroissant de densité de population
{
    let tab = Country.all_countries;
    let tab_sort = Object.values(tab).sort(function(a,b)
    {
        if(a.getPopDensity() < b.getPopDensity())
        {
            return 1;
        }
        else if(a.getPopDensity() > b.getPopDensity())
        {
            return -1;
        }
        return 0;
    });
    return tab_sort;
      
}
console.log("#7-----------------------------------------------");
console.log("Les pays trier par ordre décroissant de densité de population : ");
console.log(sortingDecreasingDensity());


function moreTopLevelDomains() //Pays possèdant plusieurs top level domain 
{
    let tab_pays_most_2_level_domain = [];
    for(let code_pays in Country.all_countries)
    {
        let topLevelDomain = Country.all_countries[code_pays].topLevelDomain;
        if(topLevelDomain !== undefined)
        {
            if(topLevelDomain.length >= 2)
            {
                tab_pays_most_2_level_domain.push(code_pays);
            }
        }
    }
    return tab_pays_most_2_level_domain;
}
console.log("#8-----------------------------------------------");
console.log("Les pays qui possède plusieurs top level domain : ");
console.log(moreTopLevelDomains());


function veryLongTrip(nom_pays) //Retourne les pays visitables à partir du pays donnée en paramètre 
{


    let pays_visitable = []; //Pays itéré
    let pays_visite= [nom_pays]; //Contient les pays que l'on retourne
    //Récuperation de l'objet du pays 
    let object_pays = Country.all_countries[nom_pays];
    //Initialisation des pays visitable 
    pays_visitable = object_pays.getBorders().map((a) => a.alpha3Code);
    while(pays_visitable.length > 0)
    {
        pays_visite.push(pays_visitable[0]); //J'ajouter l'élément border dans pays_visite
        for(let pays_frontalier of Country.all_countries[pays_visitable[0]].getBorders().map((a) => a.alpha3Code))
        {
            //Récupération de l'object frontalier 
            let object_frontalier = Country.all_countries[pays_frontalier];
            if(!(pays_visite.includes(pays_frontalier)) && !(pays_visitable.includes(pays_frontalier)))
            {
                pays_visitable.push(pays_frontalier);
            }
        }
        pays_visitable.splice(0,1);
    }

    //Si pas besoin du pays de depart faire une suppression dans pays_visite de l'alpha3code du pays d'origine
    return pays_visite;
}
console.log("#9-----------------------------------------------");
console.log("Les pays visitable à partir du pays d'origine : ");
console.log(veryLongTrip("FRA"));