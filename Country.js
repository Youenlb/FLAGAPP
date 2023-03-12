class Country
{
    static all_countries = {};
    constructor(alpha3Code,area,borders, capital, region, demonym, flag, translations,population,topLevelDomain)
    {
        this._alpha3Code = alpha3Code;
        this._area = area;
        this._borders = borders;
        this._capital = capital;
        this._region = region;
        this._demonym = demonym;
        this._flag = flag;
        this._translations = translations;
        this._population = population;
        this._topLevelDomain = topLevelDomain;
    }

    //Accesseur + mutateur des propriétés
    get alpha3Code()
    {
        return this._alpha3Code;
    }
    set alpha3Code(alpha3Code)
    {
        this._alpha3Code = alpha3Code;
    }

    get area()
    {
        return this._area;
    }
    set area(area)
    {
        this._area = area;
    }

    get borders()
    {
        return this._borders;
    }
    set borders(borders)
    {
        this._borders= borders;
    }

    get capital()
    {
        return this._capital;
    }
    set capital(capital)
    {
        this._capital = capital;
    }

    get region()
    {
        return this._region;
    }
    set region(region)
    {
        this._region = region;
    }

    get demonym() {
        return this._demonym;
        }
    set demonym(d) {
        this._demonym =d;
        }
   
    get flag() {
    return this._flag;
    }
    set flag(f) {
        this._flag =f;
        }
   
    get translations() {
    return this._translations;
    }
    set translations(t) {
        this._translations =t;
        }
   
    get population() {
    return this._population;
    }
    set population(p) {
        this._population = p;
        }
    get topLevelDomain() {
    return this._topLevelDomain;
    }
    set topLevelDomain(tld) 
    {
        this._topLevelDomain = tld;
    }
    getPopDensity()
    {
        return this._area !== 0.0 ? this._population/this._area : 0;  //Retourne 0.0 pour eviter la valeur Infinity
    }
    getBorders()
    {
        let tableau_pays_frontaliers = [];
        if(this._borders !== PAS_FRONTALIER) //Si le pays ossède des pays frontaliers
        {
            for(let pays_frontalier of this._borders)
            {
                tableau_pays_frontaliers.push(Country.all_countries[pays_frontalier]);
            }
        }
        return tableau_pays_frontaliers; 
    }
    toString() 
    {
        return "\nAlpha3Code : " + this._alpha3Code + "\nArea : " + this._area + "\nCountry : "+this._translations["en"]+"\nCapital : " + this._capital + "\nRegion : " + this._region + "\nPopulation : " + this._population+"\n\n";
    }

}



//Amélioration possible 
    //Pour la méthode getPopDensity avoir un arrondi avec 2 chiffre après la virgule ? 
    