function fill_db()
{
    let all_countries = {};
    let pays;
    let key_alpha3code;
    let borders;
    for(let indice_pays in data) //Parcours l'ensemble des pays
    {
        key_alpha3code = data[indice_pays]["alpha3Code"];
        //Gestion de la valeur borders (pays frontaliers) pour avoir une valeur même si le pays n'a pas de pays frontaliers
        borders = data[indice_pays]["borders"] === undefined ? "Aucun pays frontaliers" : data[indice_pays]["borders"];
        //Création de l'objet Country du pays
        pays = new Country(data[indice_pays]["name"],key_alpha3code,data[indice_pays]["area"],borders,data[indice_pays]["capital"],data[indice_pays]["region"],data[indice_pays]["demonym"],data[indice_pays]["flag"],data[indice_pays]["translations"],data[indice_pays]["population"],data[indice_pays]["topLevelDomain"]);
        //Ajout de l'objet dans le tableau de pays
        all_countries[key_alpha3code] = pays;
    }
    return all_countries;
}
