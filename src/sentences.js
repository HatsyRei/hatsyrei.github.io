let sentences = [
    "Pagi ini ibu mencari buku yang ayah telah baca"                    ,
    "Pagi ini ibu mencari kasut dan ayah membaca buku"                  ,
    "Pagi ini ibu memberitahu anaknya bahawa ayah telah menari"         ,
    "Malam ini ayah memberitahu anaknya bahawa ibu telah menyanyi"      ,
    "Malam ini ayah mencari majalah yang ibu telah baca"                ,
    "Malam ini ayah mencari selimut dan ibu memasak air"                ,
    "Pagi ini adik mencari tuala dan abang mencuci kereta"              ,
    "Pagi ini adik memberitahu kakaknya bahawa abang telah menari"      ,
    "Pagi ini adik mencari kunci yang abang telah simpan"               ,
    "Petang ini adik mencari keropok yang ibu telah sembunyi"           ,
    "Petang ini adik mencari gunting dan ibu memasak bubur"             ,
    "Petang ini adik memberitahu ibunya bahawa abang telah jatuh"       ,
    "Malam ini kakak memberitahu ibunya bahawa adiknya telah menangis"  ,
    "Malam ini kakak mencari baju yang ibu telah lipat"                 ,
    "Malam ini kakak mencari benang dan ibu menyapu lantai"             ,
]

// SENT = count 9 1 mark
// NBR = 9 anywhere 1 mark
// SYN = correct grammar, KK or KH can be syn 1 mark
// FUNC = component match 1 mark each
// LEX = KK, two marks each, if syn then 1 mark
// SEM = P matching (write as regex?) 1 mark

let checker = [
    {
        "KGN" : "ibu ayah",
        "KM"  : "",
        "R"   : "yang",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(baca|kaji)\\b",
        "P"   : "ibu_<KK>_buku ayah_(telah_)?<KK>"
    },
    {
        "KGN" : "ibu ayah",
        "KM"  : "",
        "R"   : "yang",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "mencari baca"
    },
];