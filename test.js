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