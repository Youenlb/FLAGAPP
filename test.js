function outsideTheContinent() //Retourne les pays avec au moins un pays frontalier en dehors de son continent
{
    let tableau_continent_different = {};
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
                    tableau_continent_different[pays["alpha3Code"]] = pays;
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
    let tableau_pays_max_voisin = {};
    let max = 0;
    for(let code_pays in Country.all_countries)
    {
        pays = Country.all_countries[code_pays];
        pays_frontalier = pays.getBorders();
        if(pays_frontalier !== undefined)
        {
            if(pays_frontalier.length > max)
            {
                tableau_pays_max_voisin = {};
                tableau_pays_max_voisin[code_pays] = pays;
                max = pays_frontalier.length;
            }
            else if(pays_frontalier.length === max)
            {
                tableau_pays_max_voisin[code_pays] = pays;
            }
        }
    }
    return tableau_pays_max_voisin;
}

console.log("Les pays avec les plus grand nombre de voisins : ");
let tab_max_voisin = moreNeighbors();
let i = 0;
for(let code_pays in tab_max_voisin)
{
    let color = "\x1b[" + (random + 31) + "m"; // Calcule le code d'échappement de couleur pour que l'affichage sur la console soit plus lisible
    console.log(color+"Pays : ");
    console.log(color+tab_max_voisin[code_pays].toString());
    console.log(color+"Voisin : ");
    for(let code_voisin of tab_max_voisin[code_pays]["borders"])
    {
        console.log(color+Country.all_countries[code_voisin].toString());
    }
    console.log(color+"--------------------------------------------------------------------");
    i++;
}

