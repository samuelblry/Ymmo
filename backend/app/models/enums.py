from enum import StrEnum


class RoleName(StrEnum):
    commercial = "Commercial"
    marketing = "Marketing"
    rh = "RH_Juridique"
    direction = "Direction"
    it = "IT_Support"


class ListingStatus(StrEnum):
    disponible = "disponible"
    sous_compromis = "sous_compromis"
    vendu = "vendu"


class ArticleStatus(StrEnum):
    brouillon = "brouillon"
    publie = "publie"
