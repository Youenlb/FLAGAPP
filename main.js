function fill_db()
{
    let pays;
    let key_alpha3code;
    let borders;
    let name;
    for(let indice_pays in data) //Parcours l'ensemble des pays
    {
        key_alpha3code = data[indice_pays]["alpha3Code"];

        //Gestion des traductions du nom du pays afin d'avoir toujours un nom à afficher dans la méthode toString() de la classe Country
        name = data[indice_pays]["name"];
        data[indice_pays]["translations"]["en"] = name;
        //Gestion de la valeur borders (pays frontaliers) pour avoir une valeur même si le pays n'a pas de pays frontaliers
        borders = data[indice_pays]["borders"] === undefined ? PAS_FRONTALIER : data[indice_pays]["borders"];
        //Création de l'objet Country du pays
        pays = new Country(
            key_alpha3code,data[indice_pays]["area"],
            borders,data[indice_pays]["capital"],
            data[indice_pays]["region"],
            data[indice_pays]["demonym"],
            data[indice_pays]["flag"],
            data[indice_pays]["translations"],
            data[indice_pays]["population"],
            data[indice_pays]["topLevelDomain"]
        );
        //Ajout de l'objet dans le tableau de pays
        Country.all_countries[key_alpha3code] = pays;
    }
}
fill_db();
console.log(Country.all_countries);
//Correction à apporter 
    //pour le choix dans toString() gerer dans fill db l'ajout de "en" et utiliser dans toString() "en" et non "fr"
    //Faire la dernière fonction de Country 