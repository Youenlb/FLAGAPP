class Country
{
    constructor(name,alpha3Code,area,borders, capital, region, demonym, flag, translations,population,topLevelDomain)
    {
        this._name = name;
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
    get name() 
    {
        return this._name;
    }
    set name(name) 
    {
    this._name = name;
    }
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
    set topLevelDomain(tld) {
    this._topLevelDomain = tld;
    }

    toString() 
    {
        if(this._translations["fr"] !== undefined) //Si la translation existe on la sélectionne
        {
            return "\nAlpha3Code : " + this._alpha3Code + "\nArea : " + this._area + "Country : "+this._translations["fr"]+"\nCapital : " + this._capital + "\nRegion : " + this._region + "\nPopulation : " + this._population+"\n\n";
        }
        //Sinon on récupére la valeur contenu dans main qui est tout le temps présente
        return "\nAlpha3Code : " + this._alpha3Code + "\nArea : " + this._area + "Country : "+this._name+"\nCapital : " + this._capital + "\nRegion : " + this._region + "\nPopulation : " + this._population+"\n\n";
    }

}