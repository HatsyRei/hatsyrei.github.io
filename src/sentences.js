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
        "R"   : "",
        "KH"  : "dan",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(mem)?(baca)\\b",
        "P"   : "ibu_<KK>_kasut ayah_<KK>_buku"
    },
    {
        "KGN" : "ibu ayah",
        "KM"  : "",
        "R"   : "bahawa",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(mem)?(beritahu)\\b \\b(menari)\\b",
        "P"   : "ibu_<KK>_anak ayah_(telah_)?<KK>"
    },
    {
        "KGN" : "ayah ibu",
        "KM"  : "",
        "R"   : "bahawa",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(mem)?(beritahu)\\b \\b(me)?nyanyi\\b",
        "P"   : "ayah_<KK>_anak ibu_(telah_)?<KK>"
    },
    {
        "KGN" : "ayah ibu",
        "KM"  : "",
        "R"   : "yang",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(baca|kaji)\\b",
        "P"   : "ayah_<KK>_majalah ibu_(telah_)?<KK>"
    },
    {
        "KGN" : "ayah ibu",
        "KM"  : "",
        "R"   : "",
        "KH"  : "dan",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(me)?(masak)\\b",
        "P"   : "ayah_<KK>_selimut ibu_<KK>_air"
    },
    {
        "KGN" : "adik abang",
        "KM"  : "",
        "R"   : "",
        "KH"  : "dan",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(men)?(cuci)\\b",
        "P"   : "adik_<KK>_tuala abang_<KK>_kereta"
    },
    {
        "KGN" : "adik abang",
        "KM"  : "",
        "R"   : "bahawa",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(mem)?(beritahu)\\b \\b(menari)\\b",
        "P"   : "adik_<KK>_kakak abang_(telah_)?<KK>"
    },
    {
        "KGN" : "adik abang",
        "KM"  : "",
        "R"   : "yang",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(simpan)\\b",
        "P"   : "adik_<KK>_kunci abang_(telah_)?<KK>"
    },
    {
        "KGN" : "adik ibu",
        "KM"  : "",
        "R"   : "yang",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(sembunyi|sorok)\\b",
        "P"   : "adik_<KK>_keropok ibu_(telah_)?<KK>"
    },
    {
        "KGN" : "adik ibu",
        "KM"  : "",
        "R"   : "",
        "KH"  : "dan",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(me)?(masak)\\b",
        "P"   : "adik_<KK>_gunting ibu_<KK>_bubur"
    },
    {
        "KGN" : "adik abang",
        "KM"  : "",
        "R"   : "bahawa",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(mem)?(beritahu)\\b \\b(jatuh)\\b",
        "P"   : "adik_<KK>_ibu abang_(telah_)?<KK>"
    },
    {
        "KGN" : "kakak adik",
        "KM"  : "",
        "R"   : "bahawa",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(mem)?(beritahu)\\b \\(me)?(nangis)\\b",
        "P"   : "kakak_<KK>_ibu adik_(telah_)?<KK>"
    },
    {
        "KGN" : "kakak ibu",
        "KM"  : "",
        "R"   : "yang",
        "KH"  : "",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(lipat)\\b",
        "P"   : "kakak_<KK>_baju ibu_(telah_)?<KK>"
    },
    {
        "KGN" : "kakak ibu",
        "KM"  : "",
        "R"   : "",
        "KH"  : "dan",
        "D"   : "ini",
        "KK"  : "\\b(men)?(cari|dapat)(kan)?\\b \\b(menyapu|sapu)\\b",
        "P"   : "kakak_<KK>_benang ibu_<KK>_lantai"
    },
];