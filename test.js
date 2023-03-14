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
console.log("Pays avec au moins un pays frontalier en dehors de son continent : ");
console.log(outsideTheContinent());

function moreNeighbors()
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

console.log("Les pays avec les plus grand nombre de voisins : ");
console.log(moreNeighbors());


function neighborless()
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

console.log("Pays qui n'ont aucuns voisins : ");
console.log(neighborless());

function withCommonLanguage() {

    let pays_contient_meme_langues = [];

    let listCountries = Country.all_countries; // récupération de tous les pays

    let pays;
    let langues_pays;
    let list_pays_frontalier;
    for(let code_pays in listCountries) {

        pays = listCountries[code_pays];
        langues_pays = pays.getLanguages();
        list_pays_frontalier = pays.getBorders();
    
        if(list_pays_frontalier !== undefined) {
            for(let pays_frontalier of list_pays_frontalier) {
                for(let languages of pays_frontalier.getLanguages()) {
                    console.log(languages);
                }
            }
                        
        }
    }

    return pays_contient_meme_langues;
}

console.log("Les pays ayant au moins un voisin parlant l’une de ses langues :");
console.log(withCommonLanguage());