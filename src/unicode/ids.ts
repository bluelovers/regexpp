/**
 * Check whether a given code point is IDStart or not.
 * @param code The code point to check.
 * @returns `true` if the code point is IDStart.
 */
export function isIdStart(code: number): boolean {
    return (
        (code >= 0x0041 && code <= 0x005a) ||
        (code >= 0x0061 && code <= 0x007a) ||
        code === 0x00aa ||
        code === 0x00b5 ||
        code === 0x00ba ||
        (code >= 0x00c0 && code <= 0x00d6) ||
        (code >= 0x00d8 && code <= 0x00f6) ||
        (code >= 0x00f8 && code <= 0x01ba) ||
        code === 0x01bb ||
        (code >= 0x01bc && code <= 0x01bf) ||
        (code >= 0x01c0 && code <= 0x01c3) ||
        (code >= 0x01c4 && code <= 0x0293) ||
        code === 0x0294 ||
        (code >= 0x0295 && code <= 0x02af) ||
        (code >= 0x02b0 && code <= 0x02c1) ||
        (code >= 0x02c6 && code <= 0x02d1) ||
        (code >= 0x02e0 && code <= 0x02e4) ||
        code === 0x02ec ||
        code === 0x02ee ||
        (code >= 0x0370 && code <= 0x0373) ||
        code === 0x0374 ||
        (code >= 0x0376 && code <= 0x0377) ||
        code === 0x037a ||
        (code >= 0x037b && code <= 0x037d) ||
        code === 0x037f ||
        code === 0x0386 ||
        (code >= 0x0388 && code <= 0x038a) ||
        code === 0x038c ||
        (code >= 0x038e && code <= 0x03a1) ||
        (code >= 0x03a3 && code <= 0x03f5) ||
        (code >= 0x03f7 && code <= 0x0481) ||
        (code >= 0x048a && code <= 0x052f) ||
        (code >= 0x0531 && code <= 0x0556) ||
        code === 0x0559 ||
        (code >= 0x0561 && code <= 0x0587) ||
        (code >= 0x05d0 && code <= 0x05ea) ||
        (code >= 0x05f0 && code <= 0x05f2) ||
        (code >= 0x0620 && code <= 0x063f) ||
        code === 0x0640 ||
        (code >= 0x0641 && code <= 0x064a) ||
        (code >= 0x066e && code <= 0x066f) ||
        (code >= 0x0671 && code <= 0x06d3) ||
        code === 0x06d5 ||
        (code >= 0x06e5 && code <= 0x06e6) ||
        (code >= 0x06ee && code <= 0x06ef) ||
        (code >= 0x06fa && code <= 0x06fc) ||
        code === 0x06ff ||
        code === 0x0710 ||
        (code >= 0x0712 && code <= 0x072f) ||
        (code >= 0x074d && code <= 0x07a5) ||
        code === 0x07b1 ||
        (code >= 0x07ca && code <= 0x07ea) ||
        (code >= 0x07f4 && code <= 0x07f5) ||
        code === 0x07fa ||
        (code >= 0x0800 && code <= 0x0815) ||
        code === 0x081a ||
        code === 0x0824 ||
        code === 0x0828 ||
        (code >= 0x0840 && code <= 0x0858) ||
        (code >= 0x0860 && code <= 0x086a) ||
        (code >= 0x08a0 && code <= 0x08b4) ||
        (code >= 0x08b6 && code <= 0x08bd) ||
        (code >= 0x0904 && code <= 0x0939) ||
        code === 0x093d ||
        code === 0x0950 ||
        (code >= 0x0958 && code <= 0x0961) ||
        code === 0x0971 ||
        (code >= 0x0972 && code <= 0x0980) ||
        (code >= 0x0985 && code <= 0x098c) ||
        (code >= 0x098f && code <= 0x0990) ||
        (code >= 0x0993 && code <= 0x09a8) ||
        (code >= 0x09aa && code <= 0x09b0) ||
        code === 0x09b2 ||
        (code >= 0x09b6 && code <= 0x09b9) ||
        code === 0x09bd ||
        code === 0x09ce ||
        (code >= 0x09dc && code <= 0x09dd) ||
        (code >= 0x09df && code <= 0x09e1) ||
        (code >= 0x09f0 && code <= 0x09f1) ||
        code === 0x09fc ||
        (code >= 0x0a05 && code <= 0x0a0a) ||
        (code >= 0x0a0f && code <= 0x0a10) ||
        (code >= 0x0a13 && code <= 0x0a28) ||
        (code >= 0x0a2a && code <= 0x0a30) ||
        (code >= 0x0a32 && code <= 0x0a33) ||
        (code >= 0x0a35 && code <= 0x0a36) ||
        (code >= 0x0a38 && code <= 0x0a39) ||
        (code >= 0x0a59 && code <= 0x0a5c) ||
        code === 0x0a5e ||
        (code >= 0x0a72 && code <= 0x0a74) ||
        (code >= 0x0a85 && code <= 0x0a8d) ||
        (code >= 0x0a8f && code <= 0x0a91) ||
        (code >= 0x0a93 && code <= 0x0aa8) ||
        (code >= 0x0aaa && code <= 0x0ab0) ||
        (code >= 0x0ab2 && code <= 0x0ab3) ||
        (code >= 0x0ab5 && code <= 0x0ab9) ||
        code === 0x0abd ||
        code === 0x0ad0 ||
        (code >= 0x0ae0 && code <= 0x0ae1) ||
        code === 0x0af9 ||
        (code >= 0x0b05 && code <= 0x0b0c) ||
        (code >= 0x0b0f && code <= 0x0b10) ||
        (code >= 0x0b13 && code <= 0x0b28) ||
        (code >= 0x0b2a && code <= 0x0b30) ||
        (code >= 0x0b32 && code <= 0x0b33) ||
        (code >= 0x0b35 && code <= 0x0b39) ||
        code === 0x0b3d ||
        (code >= 0x0b5c && code <= 0x0b5d) ||
        (code >= 0x0b5f && code <= 0x0b61) ||
        code === 0x0b71 ||
        code === 0x0b83 ||
        (code >= 0x0b85 && code <= 0x0b8a) ||
        (code >= 0x0b8e && code <= 0x0b90) ||
        (code >= 0x0b92 && code <= 0x0b95) ||
        (code >= 0x0b99 && code <= 0x0b9a) ||
        code === 0x0b9c ||
        (code >= 0x0b9e && code <= 0x0b9f) ||
        (code >= 0x0ba3 && code <= 0x0ba4) ||
        (code >= 0x0ba8 && code <= 0x0baa) ||
        (code >= 0x0bae && code <= 0x0bb9) ||
        code === 0x0bd0 ||
        (code >= 0x0c05 && code <= 0x0c0c) ||
        (code >= 0x0c0e && code <= 0x0c10) ||
        (code >= 0x0c12 && code <= 0x0c28) ||
        (code >= 0x0c2a && code <= 0x0c39) ||
        code === 0x0c3d ||
        (code >= 0x0c58 && code <= 0x0c5a) ||
        (code >= 0x0c60 && code <= 0x0c61) ||
        code === 0x0c80 ||
        (code >= 0x0c85 && code <= 0x0c8c) ||
        (code >= 0x0c8e && code <= 0x0c90) ||
        (code >= 0x0c92 && code <= 0x0ca8) ||
        (code >= 0x0caa && code <= 0x0cb3) ||
        (code >= 0x0cb5 && code <= 0x0cb9) ||
        code === 0x0cbd ||
        code === 0x0cde ||
        (code >= 0x0ce0 && code <= 0x0ce1) ||
        (code >= 0x0cf1 && code <= 0x0cf2) ||
        (code >= 0x0d05 && code <= 0x0d0c) ||
        (code >= 0x0d0e && code <= 0x0d10) ||
        (code >= 0x0d12 && code <= 0x0d3a) ||
        code === 0x0d3d ||
        code === 0x0d4e ||
        (code >= 0x0d54 && code <= 0x0d56) ||
        (code >= 0x0d5f && code <= 0x0d61) ||
        (code >= 0x0d7a && code <= 0x0d7f) ||
        (code >= 0x0d85 && code <= 0x0d96) ||
        (code >= 0x0d9a && code <= 0x0db1) ||
        (code >= 0x0db3 && code <= 0x0dbb) ||
        code === 0x0dbd ||
        (code >= 0x0dc0 && code <= 0x0dc6) ||
        (code >= 0x0e01 && code <= 0x0e30) ||
        (code >= 0x0e32 && code <= 0x0e33) ||
        (code >= 0x0e40 && code <= 0x0e45) ||
        code === 0x0e46 ||
        (code >= 0x0e81 && code <= 0x0e82) ||
        code === 0x0e84 ||
        (code >= 0x0e87 && code <= 0x0e88) ||
        code === 0x0e8a ||
        code === 0x0e8d ||
        (code >= 0x0e94 && code <= 0x0e97) ||
        (code >= 0x0e99 && code <= 0x0e9f) ||
        (code >= 0x0ea1 && code <= 0x0ea3) ||
        code === 0x0ea5 ||
        code === 0x0ea7 ||
        (code >= 0x0eaa && code <= 0x0eab) ||
        (code >= 0x0ead && code <= 0x0eb0) ||
        (code >= 0x0eb2 && code <= 0x0eb3) ||
        code === 0x0ebd ||
        (code >= 0x0ec0 && code <= 0x0ec4) ||
        code === 0x0ec6 ||
        (code >= 0x0edc && code <= 0x0edf) ||
        code === 0x0f00 ||
        (code >= 0x0f40 && code <= 0x0f47) ||
        (code >= 0x0f49 && code <= 0x0f6c) ||
        (code >= 0x0f88 && code <= 0x0f8c) ||
        (code >= 0x1000 && code <= 0x102a) ||
        code === 0x103f ||
        (code >= 0x1050 && code <= 0x1055) ||
        (code >= 0x105a && code <= 0x105d) ||
        code === 0x1061 ||
        (code >= 0x1065 && code <= 0x1066) ||
        (code >= 0x106e && code <= 0x1070) ||
        (code >= 0x1075 && code <= 0x1081) ||
        code === 0x108e ||
        (code >= 0x10a0 && code <= 0x10c5) ||
        code === 0x10c7 ||
        code === 0x10cd ||
        (code >= 0x10d0 && code <= 0x10fa) ||
        code === 0x10fc ||
        (code >= 0x10fd && code <= 0x1248) ||
        (code >= 0x124a && code <= 0x124d) ||
        (code >= 0x1250 && code <= 0x1256) ||
        code === 0x1258 ||
        (code >= 0x125a && code <= 0x125d) ||
        (code >= 0x1260 && code <= 0x1288) ||
        (code >= 0x128a && code <= 0x128d) ||
        (code >= 0x1290 && code <= 0x12b0) ||
        (code >= 0x12b2 && code <= 0x12b5) ||
        (code >= 0x12b8 && code <= 0x12be) ||
        code === 0x12c0 ||
        (code >= 0x12c2 && code <= 0x12c5) ||
        (code >= 0x12c8 && code <= 0x12d6) ||
        (code >= 0x12d8 && code <= 0x1310) ||
        (code >= 0x1312 && code <= 0x1315) ||
        (code >= 0x1318 && code <= 0x135a) ||
        (code >= 0x1380 && code <= 0x138f) ||
        (code >= 0x13a0 && code <= 0x13f5) ||
        (code >= 0x13f8 && code <= 0x13fd) ||
        (code >= 0x1401 && code <= 0x166c) ||
        (code >= 0x166f && code <= 0x167f) ||
        (code >= 0x1681 && code <= 0x169a) ||
        (code >= 0x16a0 && code <= 0x16ea) ||
        (code >= 0x16ee && code <= 0x16f0) ||
        (code >= 0x16f1 && code <= 0x16f8) ||
        (code >= 0x1700 && code <= 0x170c) ||
        (code >= 0x170e && code <= 0x1711) ||
        (code >= 0x1720 && code <= 0x1731) ||
        (code >= 0x1740 && code <= 0x1751) ||
        (code >= 0x1760 && code <= 0x176c) ||
        (code >= 0x176e && code <= 0x1770) ||
        (code >= 0x1780 && code <= 0x17b3) ||
        code === 0x17d7 ||
        code === 0x17dc ||
        (code >= 0x1820 && code <= 0x1842) ||
        code === 0x1843 ||
        (code >= 0x1844 && code <= 0x1877) ||
        (code >= 0x1880 && code <= 0x1884) ||
        (code >= 0x1885 && code <= 0x1886) ||
        (code >= 0x1887 && code <= 0x18a8) ||
        code === 0x18aa ||
        (code >= 0x18b0 && code <= 0x18f5) ||
        (code >= 0x1900 && code <= 0x191e) ||
        (code >= 0x1950 && code <= 0x196d) ||
        (code >= 0x1970 && code <= 0x1974) ||
        (code >= 0x1980 && code <= 0x19ab) ||
        (code >= 0x19b0 && code <= 0x19c9) ||
        (code >= 0x1a00 && code <= 0x1a16) ||
        (code >= 0x1a20 && code <= 0x1a54) ||
        code === 0x1aa7 ||
        (code >= 0x1b05 && code <= 0x1b33) ||
        (code >= 0x1b45 && code <= 0x1b4b) ||
        (code >= 0x1b83 && code <= 0x1ba0) ||
        (code >= 0x1bae && code <= 0x1baf) ||
        (code >= 0x1bba && code <= 0x1be5) ||
        (code >= 0x1c00 && code <= 0x1c23) ||
        (code >= 0x1c4d && code <= 0x1c4f) ||
        (code >= 0x1c5a && code <= 0x1c77) ||
        (code >= 0x1c78 && code <= 0x1c7d) ||
        (code >= 0x1c80 && code <= 0x1c88) ||
        (code >= 0x1ce9 && code <= 0x1cec) ||
        (code >= 0x1cee && code <= 0x1cf1) ||
        (code >= 0x1cf5 && code <= 0x1cf6) ||
        (code >= 0x1d00 && code <= 0x1d2b) ||
        (code >= 0x1d2c && code <= 0x1d6a) ||
        (code >= 0x1d6b && code <= 0x1d77) ||
        code === 0x1d78 ||
        (code >= 0x1d79 && code <= 0x1d9a) ||
        (code >= 0x1d9b && code <= 0x1dbf) ||
        (code >= 0x1e00 && code <= 0x1f15) ||
        (code >= 0x1f18 && code <= 0x1f1d) ||
        (code >= 0x1f20 && code <= 0x1f45) ||
        (code >= 0x1f48 && code <= 0x1f4d) ||
        (code >= 0x1f50 && code <= 0x1f57) ||
        code === 0x1f59 ||
        code === 0x1f5b ||
        code === 0x1f5d ||
        (code >= 0x1f5f && code <= 0x1f7d) ||
        (code >= 0x1f80 && code <= 0x1fb4) ||
        (code >= 0x1fb6 && code <= 0x1fbc) ||
        code === 0x1fbe ||
        (code >= 0x1fc2 && code <= 0x1fc4) ||
        (code >= 0x1fc6 && code <= 0x1fcc) ||
        (code >= 0x1fd0 && code <= 0x1fd3) ||
        (code >= 0x1fd6 && code <= 0x1fdb) ||
        (code >= 0x1fe0 && code <= 0x1fec) ||
        (code >= 0x1ff2 && code <= 0x1ff4) ||
        (code >= 0x1ff6 && code <= 0x1ffc) ||
        code === 0x2071 ||
        code === 0x207f ||
        (code >= 0x2090 && code <= 0x209c) ||
        code === 0x2102 ||
        code === 0x2107 ||
        (code >= 0x210a && code <= 0x2113) ||
        code === 0x2115 ||
        code === 0x2118 ||
        (code >= 0x2119 && code <= 0x211d) ||
        code === 0x2124 ||
        code === 0x2126 ||
        code === 0x2128 ||
        (code >= 0x212a && code <= 0x212d) ||
        code === 0x212e ||
        (code >= 0x212f && code <= 0x2134) ||
        (code >= 0x2135 && code <= 0x2138) ||
        code === 0x2139 ||
        (code >= 0x213c && code <= 0x213f) ||
        (code >= 0x2145 && code <= 0x2149) ||
        code === 0x214e ||
        (code >= 0x2160 && code <= 0x2182) ||
        (code >= 0x2183 && code <= 0x2184) ||
        (code >= 0x2185 && code <= 0x2188) ||
        (code >= 0x2c00 && code <= 0x2c2e) ||
        (code >= 0x2c30 && code <= 0x2c5e) ||
        (code >= 0x2c60 && code <= 0x2c7b) ||
        (code >= 0x2c7c && code <= 0x2c7d) ||
        (code >= 0x2c7e && code <= 0x2ce4) ||
        (code >= 0x2ceb && code <= 0x2cee) ||
        (code >= 0x2cf2 && code <= 0x2cf3) ||
        (code >= 0x2d00 && code <= 0x2d25) ||
        code === 0x2d27 ||
        code === 0x2d2d ||
        (code >= 0x2d30 && code <= 0x2d67) ||
        code === 0x2d6f ||
        (code >= 0x2d80 && code <= 0x2d96) ||
        (code >= 0x2da0 && code <= 0x2da6) ||
        (code >= 0x2da8 && code <= 0x2dae) ||
        (code >= 0x2db0 && code <= 0x2db6) ||
        (code >= 0x2db8 && code <= 0x2dbe) ||
        (code >= 0x2dc0 && code <= 0x2dc6) ||
        (code >= 0x2dc8 && code <= 0x2dce) ||
        (code >= 0x2dd0 && code <= 0x2dd6) ||
        (code >= 0x2dd8 && code <= 0x2dde) ||
        code === 0x3005 ||
        code === 0x3006 ||
        code === 0x3007 ||
        (code >= 0x3021 && code <= 0x3029) ||
        (code >= 0x3031 && code <= 0x3035) ||
        (code >= 0x3038 && code <= 0x303a) ||
        code === 0x303b ||
        code === 0x303c ||
        (code >= 0x3041 && code <= 0x3096) ||
        (code >= 0x309b && code <= 0x309c) ||
        (code >= 0x309d && code <= 0x309e) ||
        code === 0x309f ||
        (code >= 0x30a1 && code <= 0x30fa) ||
        (code >= 0x30fc && code <= 0x30fe) ||
        code === 0x30ff ||
        (code >= 0x3105 && code <= 0x312e) ||
        (code >= 0x3131 && code <= 0x318e) ||
        (code >= 0x31a0 && code <= 0x31ba) ||
        (code >= 0x31f0 && code <= 0x31ff) ||
        (code >= 0x3400 && code <= 0x4db5) ||
        (code >= 0x4e00 && code <= 0x9fea) ||
        (code >= 0xa000 && code <= 0xa014) ||
        code === 0xa015 ||
        (code >= 0xa016 && code <= 0xa48c) ||
        (code >= 0xa4d0 && code <= 0xa4f7) ||
        (code >= 0xa4f8 && code <= 0xa4fd) ||
        (code >= 0xa500 && code <= 0xa60b) ||
        code === 0xa60c ||
        (code >= 0xa610 && code <= 0xa61f) ||
        (code >= 0xa62a && code <= 0xa62b) ||
        (code >= 0xa640 && code <= 0xa66d) ||
        code === 0xa66e ||
        code === 0xa67f ||
        (code >= 0xa680 && code <= 0xa69b) ||
        (code >= 0xa69c && code <= 0xa69d) ||
        (code >= 0xa6a0 && code <= 0xa6e5) ||
        (code >= 0xa6e6 && code <= 0xa6ef) ||
        (code >= 0xa717 && code <= 0xa71f) ||
        (code >= 0xa722 && code <= 0xa76f) ||
        code === 0xa770 ||
        (code >= 0xa771 && code <= 0xa787) ||
        code === 0xa788 ||
        (code >= 0xa78b && code <= 0xa78e) ||
        code === 0xa78f ||
        (code >= 0xa790 && code <= 0xa7ae) ||
        (code >= 0xa7b0 && code <= 0xa7b7) ||
        code === 0xa7f7 ||
        (code >= 0xa7f8 && code <= 0xa7f9) ||
        code === 0xa7fa ||
        (code >= 0xa7fb && code <= 0xa801) ||
        (code >= 0xa803 && code <= 0xa805) ||
        (code >= 0xa807 && code <= 0xa80a) ||
        (code >= 0xa80c && code <= 0xa822) ||
        (code >= 0xa840 && code <= 0xa873) ||
        (code >= 0xa882 && code <= 0xa8b3) ||
        (code >= 0xa8f2 && code <= 0xa8f7) ||
        code === 0xa8fb ||
        code === 0xa8fd ||
        (code >= 0xa90a && code <= 0xa925) ||
        (code >= 0xa930 && code <= 0xa946) ||
        (code >= 0xa960 && code <= 0xa97c) ||
        (code >= 0xa984 && code <= 0xa9b2) ||
        code === 0xa9cf ||
        (code >= 0xa9e0 && code <= 0xa9e4) ||
        code === 0xa9e6 ||
        (code >= 0xa9e7 && code <= 0xa9ef) ||
        (code >= 0xa9fa && code <= 0xa9fe) ||
        (code >= 0xaa00 && code <= 0xaa28) ||
        (code >= 0xaa40 && code <= 0xaa42) ||
        (code >= 0xaa44 && code <= 0xaa4b) ||
        (code >= 0xaa60 && code <= 0xaa6f) ||
        code === 0xaa70 ||
        (code >= 0xaa71 && code <= 0xaa76) ||
        code === 0xaa7a ||
        (code >= 0xaa7e && code <= 0xaaaf) ||
        code === 0xaab1 ||
        (code >= 0xaab5 && code <= 0xaab6) ||
        (code >= 0xaab9 && code <= 0xaabd) ||
        code === 0xaac0 ||
        code === 0xaac2 ||
        (code >= 0xaadb && code <= 0xaadc) ||
        code === 0xaadd ||
        (code >= 0xaae0 && code <= 0xaaea) ||
        code === 0xaaf2 ||
        (code >= 0xaaf3 && code <= 0xaaf4) ||
        (code >= 0xab01 && code <= 0xab06) ||
        (code >= 0xab09 && code <= 0xab0e) ||
        (code >= 0xab11 && code <= 0xab16) ||
        (code >= 0xab20 && code <= 0xab26) ||
        (code >= 0xab28 && code <= 0xab2e) ||
        (code >= 0xab30 && code <= 0xab5a) ||
        (code >= 0xab5c && code <= 0xab5f) ||
        (code >= 0xab60 && code <= 0xab65) ||
        (code >= 0xab70 && code <= 0xabbf) ||
        (code >= 0xabc0 && code <= 0xabe2) ||
        (code >= 0xac00 && code <= 0xd7a3) ||
        (code >= 0xd7b0 && code <= 0xd7c6) ||
        (code >= 0xd7cb && code <= 0xd7fb) ||
        (code >= 0xf900 && code <= 0xfa6d) ||
        (code >= 0xfa70 && code <= 0xfad9) ||
        (code >= 0xfb00 && code <= 0xfb06) ||
        (code >= 0xfb13 && code <= 0xfb17) ||
        code === 0xfb1d ||
        (code >= 0xfb1f && code <= 0xfb28) ||
        (code >= 0xfb2a && code <= 0xfb36) ||
        (code >= 0xfb38 && code <= 0xfb3c) ||
        code === 0xfb3e ||
        (code >= 0xfb40 && code <= 0xfb41) ||
        (code >= 0xfb43 && code <= 0xfb44) ||
        (code >= 0xfb46 && code <= 0xfbb1) ||
        (code >= 0xfbd3 && code <= 0xfd3d) ||
        (code >= 0xfd50 && code <= 0xfd8f) ||
        (code >= 0xfd92 && code <= 0xfdc7) ||
        (code >= 0xfdf0 && code <= 0xfdfb) ||
        (code >= 0xfe70 && code <= 0xfe74) ||
        (code >= 0xfe76 && code <= 0xfefc) ||
        (code >= 0xff21 && code <= 0xff3a) ||
        (code >= 0xff41 && code <= 0xff5a) ||
        (code >= 0xff66 && code <= 0xff6f) ||
        code === 0xff70 ||
        (code >= 0xff71 && code <= 0xff9d) ||
        (code >= 0xff9e && code <= 0xff9f) ||
        (code >= 0xffa0 && code <= 0xffbe) ||
        (code >= 0xffc2 && code <= 0xffc7) ||
        (code >= 0xffca && code <= 0xffcf) ||
        (code >= 0xffd2 && code <= 0xffd7) ||
        (code >= 0xffda && code <= 0xffdc) ||
        (code >= 0x10000 && code <= 0x1000b) ||
        (code >= 0x1000d && code <= 0x10026) ||
        (code >= 0x10028 && code <= 0x1003a) ||
        (code >= 0x1003c && code <= 0x1003d) ||
        (code >= 0x1003f && code <= 0x1004d) ||
        (code >= 0x10050 && code <= 0x1005d) ||
        (code >= 0x10080 && code <= 0x100fa) ||
        (code >= 0x10140 && code <= 0x10174) ||
        (code >= 0x10280 && code <= 0x1029c) ||
        (code >= 0x102a0 && code <= 0x102d0) ||
        (code >= 0x10300 && code <= 0x1031f) ||
        (code >= 0x1032d && code <= 0x10340) ||
        code === 0x10341 ||
        (code >= 0x10342 && code <= 0x10349) ||
        code === 0x1034a ||
        (code >= 0x10350 && code <= 0x10375) ||
        (code >= 0x10380 && code <= 0x1039d) ||
        (code >= 0x103a0 && code <= 0x103c3) ||
        (code >= 0x103c8 && code <= 0x103cf) ||
        (code >= 0x103d1 && code <= 0x103d5) ||
        (code >= 0x10400 && code <= 0x1044f) ||
        (code >= 0x10450 && code <= 0x1049d) ||
        (code >= 0x104b0 && code <= 0x104d3) ||
        (code >= 0x104d8 && code <= 0x104fb) ||
        (code >= 0x10500 && code <= 0x10527) ||
        (code >= 0x10530 && code <= 0x10563) ||
        (code >= 0x10600 && code <= 0x10736) ||
        (code >= 0x10740 && code <= 0x10755) ||
        (code >= 0x10760 && code <= 0x10767) ||
        (code >= 0x10800 && code <= 0x10805) ||
        code === 0x10808 ||
        (code >= 0x1080a && code <= 0x10835) ||
        (code >= 0x10837 && code <= 0x10838) ||
        code === 0x1083c ||
        (code >= 0x1083f && code <= 0x10855) ||
        (code >= 0x10860 && code <= 0x10876) ||
        (code >= 0x10880 && code <= 0x1089e) ||
        (code >= 0x108e0 && code <= 0x108f2) ||
        (code >= 0x108f4 && code <= 0x108f5) ||
        (code >= 0x10900 && code <= 0x10915) ||
        (code >= 0x10920 && code <= 0x10939) ||
        (code >= 0x10980 && code <= 0x109b7) ||
        (code >= 0x109be && code <= 0x109bf) ||
        code === 0x10a00 ||
        (code >= 0x10a10 && code <= 0x10a13) ||
        (code >= 0x10a15 && code <= 0x10a17) ||
        (code >= 0x10a19 && code <= 0x10a33) ||
        (code >= 0x10a60 && code <= 0x10a7c) ||
        (code >= 0x10a80 && code <= 0x10a9c) ||
        (code >= 0x10ac0 && code <= 0x10ac7) ||
        (code >= 0x10ac9 && code <= 0x10ae4) ||
        (code >= 0x10b00 && code <= 0x10b35) ||
        (code >= 0x10b40 && code <= 0x10b55) ||
        (code >= 0x10b60 && code <= 0x10b72) ||
        (code >= 0x10b80 && code <= 0x10b91) ||
        (code >= 0x10c00 && code <= 0x10c48) ||
        (code >= 0x10c80 && code <= 0x10cb2) ||
        (code >= 0x10cc0 && code <= 0x10cf2) ||
        (code >= 0x11003 && code <= 0x11037) ||
        (code >= 0x11083 && code <= 0x110af) ||
        (code >= 0x110d0 && code <= 0x110e8) ||
        (code >= 0x11103 && code <= 0x11126) ||
        (code >= 0x11150 && code <= 0x11172) ||
        code === 0x11176 ||
        (code >= 0x11183 && code <= 0x111b2) ||
        (code >= 0x111c1 && code <= 0x111c4) ||
        code === 0x111da ||
        code === 0x111dc ||
        (code >= 0x11200 && code <= 0x11211) ||
        (code >= 0x11213 && code <= 0x1122b) ||
        (code >= 0x11280 && code <= 0x11286) ||
        code === 0x11288 ||
        (code >= 0x1128a && code <= 0x1128d) ||
        (code >= 0x1128f && code <= 0x1129d) ||
        (code >= 0x1129f && code <= 0x112a8) ||
        (code >= 0x112b0 && code <= 0x112de) ||
        (code >= 0x11305 && code <= 0x1130c) ||
        (code >= 0x1130f && code <= 0x11310) ||
        (code >= 0x11313 && code <= 0x11328) ||
        (code >= 0x1132a && code <= 0x11330) ||
        (code >= 0x11332 && code <= 0x11333) ||
        (code >= 0x11335 && code <= 0x11339) ||
        code === 0x1133d ||
        code === 0x11350 ||
        (code >= 0x1135d && code <= 0x11361) ||
        (code >= 0x11400 && code <= 0x11434) ||
        (code >= 0x11447 && code <= 0x1144a) ||
        (code >= 0x11480 && code <= 0x114af) ||
        (code >= 0x114c4 && code <= 0x114c5) ||
        code === 0x114c7 ||
        (code >= 0x11580 && code <= 0x115ae) ||
        (code >= 0x115d8 && code <= 0x115db) ||
        (code >= 0x11600 && code <= 0x1162f) ||
        code === 0x11644 ||
        (code >= 0x11680 && code <= 0x116aa) ||
        (code >= 0x11700 && code <= 0x11719) ||
        (code >= 0x118a0 && code <= 0x118df) ||
        code === 0x118ff ||
        code === 0x11a00 ||
        (code >= 0x11a0b && code <= 0x11a32) ||
        code === 0x11a3a ||
        code === 0x11a50 ||
        (code >= 0x11a5c && code <= 0x11a83) ||
        (code >= 0x11a86 && code <= 0x11a89) ||
        (code >= 0x11ac0 && code <= 0x11af8) ||
        (code >= 0x11c00 && code <= 0x11c08) ||
        (code >= 0x11c0a && code <= 0x11c2e) ||
        code === 0x11c40 ||
        (code >= 0x11c72 && code <= 0x11c8f) ||
        (code >= 0x11d00 && code <= 0x11d06) ||
        (code >= 0x11d08 && code <= 0x11d09) ||
        (code >= 0x11d0b && code <= 0x11d30) ||
        code === 0x11d46 ||
        (code >= 0x12000 && code <= 0x12399) ||
        (code >= 0x12400 && code <= 0x1246e) ||
        (code >= 0x12480 && code <= 0x12543) ||
        (code >= 0x13000 && code <= 0x1342e) ||
        (code >= 0x14400 && code <= 0x14646) ||
        (code >= 0x16800 && code <= 0x16a38) ||
        (code >= 0x16a40 && code <= 0x16a5e) ||
        (code >= 0x16ad0 && code <= 0x16aed) ||
        (code >= 0x16b00 && code <= 0x16b2f) ||
        (code >= 0x16b40 && code <= 0x16b43) ||
        (code >= 0x16b63 && code <= 0x16b77) ||
        (code >= 0x16b7d && code <= 0x16b8f) ||
        (code >= 0x16f00 && code <= 0x16f44) ||
        code === 0x16f50 ||
        (code >= 0x16f93 && code <= 0x16f9f) ||
        (code >= 0x16fe0 && code <= 0x16fe1) ||
        (code >= 0x17000 && code <= 0x187ec) ||
        (code >= 0x18800 && code <= 0x18af2) ||
        (code >= 0x1b000 && code <= 0x1b11e) ||
        (code >= 0x1b170 && code <= 0x1b2fb) ||
        (code >= 0x1bc00 && code <= 0x1bc6a) ||
        (code >= 0x1bc70 && code <= 0x1bc7c) ||
        (code >= 0x1bc80 && code <= 0x1bc88) ||
        (code >= 0x1bc90 && code <= 0x1bc99) ||
        (code >= 0x1d400 && code <= 0x1d454) ||
        (code >= 0x1d456 && code <= 0x1d49c) ||
        (code >= 0x1d49e && code <= 0x1d49f) ||
        code === 0x1d4a2 ||
        (code >= 0x1d4a5 && code <= 0x1d4a6) ||
        (code >= 0x1d4a9 && code <= 0x1d4ac) ||
        (code >= 0x1d4ae && code <= 0x1d4b9) ||
        code === 0x1d4bb ||
        (code >= 0x1d4bd && code <= 0x1d4c3) ||
        (code >= 0x1d4c5 && code <= 0x1d505) ||
        (code >= 0x1d507 && code <= 0x1d50a) ||
        (code >= 0x1d50d && code <= 0x1d514) ||
        (code >= 0x1d516 && code <= 0x1d51c) ||
        (code >= 0x1d51e && code <= 0x1d539) ||
        (code >= 0x1d53b && code <= 0x1d53e) ||
        (code >= 0x1d540 && code <= 0x1d544) ||
        code === 0x1d546 ||
        (code >= 0x1d54a && code <= 0x1d550) ||
        (code >= 0x1d552 && code <= 0x1d6a5) ||
        (code >= 0x1d6a8 && code <= 0x1d6c0) ||
        (code >= 0x1d6c2 && code <= 0x1d6da) ||
        (code >= 0x1d6dc && code <= 0x1d6fa) ||
        (code >= 0x1d6fc && code <= 0x1d714) ||
        (code >= 0x1d716 && code <= 0x1d734) ||
        (code >= 0x1d736 && code <= 0x1d74e) ||
        (code >= 0x1d750 && code <= 0x1d76e) ||
        (code >= 0x1d770 && code <= 0x1d788) ||
        (code >= 0x1d78a && code <= 0x1d7a8) ||
        (code >= 0x1d7aa && code <= 0x1d7c2) ||
        (code >= 0x1d7c4 && code <= 0x1d7cb) ||
        (code >= 0x1e800 && code <= 0x1e8c4) ||
        (code >= 0x1e900 && code <= 0x1e943) ||
        (code >= 0x1ee00 && code <= 0x1ee03) ||
        (code >= 0x1ee05 && code <= 0x1ee1f) ||
        (code >= 0x1ee21 && code <= 0x1ee22) ||
        code === 0x1ee24 ||
        code === 0x1ee27 ||
        (code >= 0x1ee29 && code <= 0x1ee32) ||
        (code >= 0x1ee34 && code <= 0x1ee37) ||
        code === 0x1ee39 ||
        code === 0x1ee3b ||
        code === 0x1ee42 ||
        code === 0x1ee47 ||
        code === 0x1ee49 ||
        code === 0x1ee4b ||
        (code >= 0x1ee4d && code <= 0x1ee4f) ||
        (code >= 0x1ee51 && code <= 0x1ee52) ||
        code === 0x1ee54 ||
        code === 0x1ee57 ||
        code === 0x1ee59 ||
        code === 0x1ee5b ||
        code === 0x1ee5d ||
        code === 0x1ee5f ||
        (code >= 0x1ee61 && code <= 0x1ee62) ||
        code === 0x1ee64 ||
        (code >= 0x1ee67 && code <= 0x1ee6a) ||
        (code >= 0x1ee6c && code <= 0x1ee72) ||
        (code >= 0x1ee74 && code <= 0x1ee77) ||
        (code >= 0x1ee79 && code <= 0x1ee7c) ||
        code === 0x1ee7e ||
        (code >= 0x1ee80 && code <= 0x1ee89) ||
        (code >= 0x1ee8b && code <= 0x1ee9b) ||
        (code >= 0x1eea1 && code <= 0x1eea3) ||
        (code >= 0x1eea5 && code <= 0x1eea9) ||
        (code >= 0x1eeab && code <= 0x1eebb) ||
        (code >= 0x20000 && code <= 0x2a6d6) ||
        (code >= 0x2a700 && code <= 0x2b734) ||
        (code >= 0x2b740 && code <= 0x2b81d) ||
        (code >= 0x2b820 && code <= 0x2cea1) ||
        (code >= 0x2ceb0 && code <= 0x2ebe0) ||
        (code >= 0x2f800 && code <= 0x2fa1d)
    )
}

/**
 * Check whether a given code point is IDContinue or not.
 * @param code The code point to check.
 * @returns `true` if the code point is IDContinue.
 */
export function isIdContinue(code: number): boolean {
    return (
        isIdStart(code) ||
        (code >= 0x0030 && code <= 0x0039) ||
        code === 0x005f ||
        code === 0x00b7 ||
        (code >= 0x0300 && code <= 0x036f) ||
        code === 0x0387 ||
        (code >= 0x0483 && code <= 0x0487) ||
        (code >= 0x0591 && code <= 0x05bd) ||
        code === 0x05bf ||
        (code >= 0x05c1 && code <= 0x05c2) ||
        (code >= 0x05c4 && code <= 0x05c5) ||
        code === 0x05c7 ||
        (code >= 0x0610 && code <= 0x061a) ||
        (code >= 0x064b && code <= 0x065f) ||
        (code >= 0x0660 && code <= 0x0669) ||
        code === 0x0670 ||
        (code >= 0x06d6 && code <= 0x06dc) ||
        (code >= 0x06df && code <= 0x06e4) ||
        (code >= 0x06e7 && code <= 0x06e8) ||
        (code >= 0x06ea && code <= 0x06ed) ||
        (code >= 0x06f0 && code <= 0x06f9) ||
        code === 0x0711 ||
        (code >= 0x0730 && code <= 0x074a) ||
        (code >= 0x07a6 && code <= 0x07b0) ||
        (code >= 0x07c0 && code <= 0x07c9) ||
        (code >= 0x07eb && code <= 0x07f3) ||
        (code >= 0x0816 && code <= 0x0819) ||
        (code >= 0x081b && code <= 0x0823) ||
        (code >= 0x0825 && code <= 0x0827) ||
        (code >= 0x0829 && code <= 0x082d) ||
        (code >= 0x0859 && code <= 0x085b) ||
        (code >= 0x08d4 && code <= 0x08e1) ||
        (code >= 0x08e3 && code <= 0x0902) ||
        code === 0x0903 ||
        code === 0x093a ||
        code === 0x093b ||
        code === 0x093c ||
        (code >= 0x093e && code <= 0x0940) ||
        (code >= 0x0941 && code <= 0x0948) ||
        (code >= 0x0949 && code <= 0x094c) ||
        code === 0x094d ||
        (code >= 0x094e && code <= 0x094f) ||
        (code >= 0x0951 && code <= 0x0957) ||
        (code >= 0x0962 && code <= 0x0963) ||
        (code >= 0x0966 && code <= 0x096f) ||
        code === 0x0981 ||
        (code >= 0x0982 && code <= 0x0983) ||
        code === 0x09bc ||
        (code >= 0x09be && code <= 0x09c0) ||
        (code >= 0x09c1 && code <= 0x09c4) ||
        (code >= 0x09c7 && code <= 0x09c8) ||
        (code >= 0x09cb && code <= 0x09cc) ||
        code === 0x09cd ||
        code === 0x09d7 ||
        (code >= 0x09e2 && code <= 0x09e3) ||
        (code >= 0x09e6 && code <= 0x09ef) ||
        (code >= 0x0a01 && code <= 0x0a02) ||
        code === 0x0a03 ||
        code === 0x0a3c ||
        (code >= 0x0a3e && code <= 0x0a40) ||
        (code >= 0x0a41 && code <= 0x0a42) ||
        (code >= 0x0a47 && code <= 0x0a48) ||
        (code >= 0x0a4b && code <= 0x0a4d) ||
        code === 0x0a51 ||
        (code >= 0x0a66 && code <= 0x0a6f) ||
        (code >= 0x0a70 && code <= 0x0a71) ||
        code === 0x0a75 ||
        (code >= 0x0a81 && code <= 0x0a82) ||
        code === 0x0a83 ||
        code === 0x0abc ||
        (code >= 0x0abe && code <= 0x0ac0) ||
        (code >= 0x0ac1 && code <= 0x0ac5) ||
        (code >= 0x0ac7 && code <= 0x0ac8) ||
        code === 0x0ac9 ||
        (code >= 0x0acb && code <= 0x0acc) ||
        code === 0x0acd ||
        (code >= 0x0ae2 && code <= 0x0ae3) ||
        (code >= 0x0ae6 && code <= 0x0aef) ||
        (code >= 0x0afa && code <= 0x0aff) ||
        code === 0x0b01 ||
        (code >= 0x0b02 && code <= 0x0b03) ||
        code === 0x0b3c ||
        code === 0x0b3e ||
        code === 0x0b3f ||
        code === 0x0b40 ||
        (code >= 0x0b41 && code <= 0x0b44) ||
        (code >= 0x0b47 && code <= 0x0b48) ||
        (code >= 0x0b4b && code <= 0x0b4c) ||
        code === 0x0b4d ||
        code === 0x0b56 ||
        code === 0x0b57 ||
        (code >= 0x0b62 && code <= 0x0b63) ||
        (code >= 0x0b66 && code <= 0x0b6f) ||
        code === 0x0b82 ||
        (code >= 0x0bbe && code <= 0x0bbf) ||
        code === 0x0bc0 ||
        (code >= 0x0bc1 && code <= 0x0bc2) ||
        (code >= 0x0bc6 && code <= 0x0bc8) ||
        (code >= 0x0bca && code <= 0x0bcc) ||
        code === 0x0bcd ||
        code === 0x0bd7 ||
        (code >= 0x0be6 && code <= 0x0bef) ||
        code === 0x0c00 ||
        (code >= 0x0c01 && code <= 0x0c03) ||
        (code >= 0x0c3e && code <= 0x0c40) ||
        (code >= 0x0c41 && code <= 0x0c44) ||
        (code >= 0x0c46 && code <= 0x0c48) ||
        (code >= 0x0c4a && code <= 0x0c4d) ||
        (code >= 0x0c55 && code <= 0x0c56) ||
        (code >= 0x0c62 && code <= 0x0c63) ||
        (code >= 0x0c66 && code <= 0x0c6f) ||
        code === 0x0c81 ||
        (code >= 0x0c82 && code <= 0x0c83) ||
        code === 0x0cbc ||
        code === 0x0cbe ||
        code === 0x0cbf ||
        (code >= 0x0cc0 && code <= 0x0cc4) ||
        code === 0x0cc6 ||
        (code >= 0x0cc7 && code <= 0x0cc8) ||
        (code >= 0x0cca && code <= 0x0ccb) ||
        (code >= 0x0ccc && code <= 0x0ccd) ||
        (code >= 0x0cd5 && code <= 0x0cd6) ||
        (code >= 0x0ce2 && code <= 0x0ce3) ||
        (code >= 0x0ce6 && code <= 0x0cef) ||
        (code >= 0x0d00 && code <= 0x0d01) ||
        (code >= 0x0d02 && code <= 0x0d03) ||
        (code >= 0x0d3b && code <= 0x0d3c) ||
        (code >= 0x0d3e && code <= 0x0d40) ||
        (code >= 0x0d41 && code <= 0x0d44) ||
        (code >= 0x0d46 && code <= 0x0d48) ||
        (code >= 0x0d4a && code <= 0x0d4c) ||
        code === 0x0d4d ||
        code === 0x0d57 ||
        (code >= 0x0d62 && code <= 0x0d63) ||
        (code >= 0x0d66 && code <= 0x0d6f) ||
        (code >= 0x0d82 && code <= 0x0d83) ||
        code === 0x0dca ||
        (code >= 0x0dcf && code <= 0x0dd1) ||
        (code >= 0x0dd2 && code <= 0x0dd4) ||
        code === 0x0dd6 ||
        (code >= 0x0dd8 && code <= 0x0ddf) ||
        (code >= 0x0de6 && code <= 0x0def) ||
        (code >= 0x0df2 && code <= 0x0df3) ||
        code === 0x0e31 ||
        (code >= 0x0e34 && code <= 0x0e3a) ||
        (code >= 0x0e47 && code <= 0x0e4e) ||
        (code >= 0x0e50 && code <= 0x0e59) ||
        code === 0x0eb1 ||
        (code >= 0x0eb4 && code <= 0x0eb9) ||
        (code >= 0x0ebb && code <= 0x0ebc) ||
        (code >= 0x0ec8 && code <= 0x0ecd) ||
        (code >= 0x0ed0 && code <= 0x0ed9) ||
        (code >= 0x0f18 && code <= 0x0f19) ||
        (code >= 0x0f20 && code <= 0x0f29) ||
        code === 0x0f35 ||
        code === 0x0f37 ||
        code === 0x0f39 ||
        (code >= 0x0f3e && code <= 0x0f3f) ||
        (code >= 0x0f71 && code <= 0x0f7e) ||
        code === 0x0f7f ||
        (code >= 0x0f80 && code <= 0x0f84) ||
        (code >= 0x0f86 && code <= 0x0f87) ||
        (code >= 0x0f8d && code <= 0x0f97) ||
        (code >= 0x0f99 && code <= 0x0fbc) ||
        code === 0x0fc6 ||
        (code >= 0x102b && code <= 0x102c) ||
        (code >= 0x102d && code <= 0x1030) ||
        code === 0x1031 ||
        (code >= 0x1032 && code <= 0x1037) ||
        code === 0x1038 ||
        (code >= 0x1039 && code <= 0x103a) ||
        (code >= 0x103b && code <= 0x103c) ||
        (code >= 0x103d && code <= 0x103e) ||
        (code >= 0x1040 && code <= 0x1049) ||
        (code >= 0x1056 && code <= 0x1057) ||
        (code >= 0x1058 && code <= 0x1059) ||
        (code >= 0x105e && code <= 0x1060) ||
        (code >= 0x1062 && code <= 0x1064) ||
        (code >= 0x1067 && code <= 0x106d) ||
        (code >= 0x1071 && code <= 0x1074) ||
        code === 0x1082 ||
        (code >= 0x1083 && code <= 0x1084) ||
        (code >= 0x1085 && code <= 0x1086) ||
        (code >= 0x1087 && code <= 0x108c) ||
        code === 0x108d ||
        code === 0x108f ||
        (code >= 0x1090 && code <= 0x1099) ||
        (code >= 0x109a && code <= 0x109c) ||
        code === 0x109d ||
        (code >= 0x135d && code <= 0x135f) ||
        (code >= 0x1369 && code <= 0x1371) ||
        (code >= 0x1712 && code <= 0x1714) ||
        (code >= 0x1732 && code <= 0x1734) ||
        (code >= 0x1752 && code <= 0x1753) ||
        (code >= 0x1772 && code <= 0x1773) ||
        (code >= 0x17b4 && code <= 0x17b5) ||
        code === 0x17b6 ||
        (code >= 0x17b7 && code <= 0x17bd) ||
        (code >= 0x17be && code <= 0x17c5) ||
        code === 0x17c6 ||
        (code >= 0x17c7 && code <= 0x17c8) ||
        (code >= 0x17c9 && code <= 0x17d3) ||
        code === 0x17dd ||
        (code >= 0x17e0 && code <= 0x17e9) ||
        (code >= 0x180b && code <= 0x180d) ||
        (code >= 0x1810 && code <= 0x1819) ||
        code === 0x18a9 ||
        (code >= 0x1920 && code <= 0x1922) ||
        (code >= 0x1923 && code <= 0x1926) ||
        (code >= 0x1927 && code <= 0x1928) ||
        (code >= 0x1929 && code <= 0x192b) ||
        (code >= 0x1930 && code <= 0x1931) ||
        code === 0x1932 ||
        (code >= 0x1933 && code <= 0x1938) ||
        (code >= 0x1939 && code <= 0x193b) ||
        (code >= 0x1946 && code <= 0x194f) ||
        (code >= 0x19d0 && code <= 0x19d9) ||
        code === 0x19da ||
        (code >= 0x1a17 && code <= 0x1a18) ||
        (code >= 0x1a19 && code <= 0x1a1a) ||
        code === 0x1a1b ||
        code === 0x1a55 ||
        code === 0x1a56 ||
        code === 0x1a57 ||
        (code >= 0x1a58 && code <= 0x1a5e) ||
        code === 0x1a60 ||
        code === 0x1a61 ||
        code === 0x1a62 ||
        (code >= 0x1a63 && code <= 0x1a64) ||
        (code >= 0x1a65 && code <= 0x1a6c) ||
        (code >= 0x1a6d && code <= 0x1a72) ||
        (code >= 0x1a73 && code <= 0x1a7c) ||
        code === 0x1a7f ||
        (code >= 0x1a80 && code <= 0x1a89) ||
        (code >= 0x1a90 && code <= 0x1a99) ||
        (code >= 0x1ab0 && code <= 0x1abd) ||
        (code >= 0x1b00 && code <= 0x1b03) ||
        code === 0x1b04 ||
        code === 0x1b34 ||
        code === 0x1b35 ||
        (code >= 0x1b36 && code <= 0x1b3a) ||
        code === 0x1b3b ||
        code === 0x1b3c ||
        (code >= 0x1b3d && code <= 0x1b41) ||
        code === 0x1b42 ||
        (code >= 0x1b43 && code <= 0x1b44) ||
        (code >= 0x1b50 && code <= 0x1b59) ||
        (code >= 0x1b6b && code <= 0x1b73) ||
        (code >= 0x1b80 && code <= 0x1b81) ||
        code === 0x1b82 ||
        code === 0x1ba1 ||
        (code >= 0x1ba2 && code <= 0x1ba5) ||
        (code >= 0x1ba6 && code <= 0x1ba7) ||
        (code >= 0x1ba8 && code <= 0x1ba9) ||
        code === 0x1baa ||
        (code >= 0x1bab && code <= 0x1bad) ||
        (code >= 0x1bb0 && code <= 0x1bb9) ||
        code === 0x1be6 ||
        code === 0x1be7 ||
        (code >= 0x1be8 && code <= 0x1be9) ||
        (code >= 0x1bea && code <= 0x1bec) ||
        code === 0x1bed ||
        code === 0x1bee ||
        (code >= 0x1bef && code <= 0x1bf1) ||
        (code >= 0x1bf2 && code <= 0x1bf3) ||
        (code >= 0x1c24 && code <= 0x1c2b) ||
        (code >= 0x1c2c && code <= 0x1c33) ||
        (code >= 0x1c34 && code <= 0x1c35) ||
        (code >= 0x1c36 && code <= 0x1c37) ||
        (code >= 0x1c40 && code <= 0x1c49) ||
        (code >= 0x1c50 && code <= 0x1c59) ||
        (code >= 0x1cd0 && code <= 0x1cd2) ||
        (code >= 0x1cd4 && code <= 0x1ce0) ||
        code === 0x1ce1 ||
        (code >= 0x1ce2 && code <= 0x1ce8) ||
        code === 0x1ced ||
        (code >= 0x1cf2 && code <= 0x1cf3) ||
        code === 0x1cf4 ||
        code === 0x1cf7 ||
        (code >= 0x1cf8 && code <= 0x1cf9) ||
        (code >= 0x1dc0 && code <= 0x1df9) ||
        (code >= 0x1dfb && code <= 0x1dff) ||
        (code >= 0x203f && code <= 0x2040) ||
        code === 0x2054 ||
        (code >= 0x20d0 && code <= 0x20dc) ||
        code === 0x20e1 ||
        (code >= 0x20e5 && code <= 0x20f0) ||
        (code >= 0x2cef && code <= 0x2cf1) ||
        code === 0x2d7f ||
        (code >= 0x2de0 && code <= 0x2dff) ||
        (code >= 0x302a && code <= 0x302d) ||
        (code >= 0x302e && code <= 0x302f) ||
        (code >= 0x3099 && code <= 0x309a) ||
        (code >= 0xa620 && code <= 0xa629) ||
        code === 0xa66f ||
        (code >= 0xa674 && code <= 0xa67d) ||
        (code >= 0xa69e && code <= 0xa69f) ||
        (code >= 0xa6f0 && code <= 0xa6f1) ||
        code === 0xa802 ||
        code === 0xa806 ||
        code === 0xa80b ||
        (code >= 0xa823 && code <= 0xa824) ||
        (code >= 0xa825 && code <= 0xa826) ||
        code === 0xa827 ||
        (code >= 0xa880 && code <= 0xa881) ||
        (code >= 0xa8b4 && code <= 0xa8c3) ||
        (code >= 0xa8c4 && code <= 0xa8c5) ||
        (code >= 0xa8d0 && code <= 0xa8d9) ||
        (code >= 0xa8e0 && code <= 0xa8f1) ||
        (code >= 0xa900 && code <= 0xa909) ||
        (code >= 0xa926 && code <= 0xa92d) ||
        (code >= 0xa947 && code <= 0xa951) ||
        (code >= 0xa952 && code <= 0xa953) ||
        (code >= 0xa980 && code <= 0xa982) ||
        code === 0xa983 ||
        code === 0xa9b3 ||
        (code >= 0xa9b4 && code <= 0xa9b5) ||
        (code >= 0xa9b6 && code <= 0xa9b9) ||
        (code >= 0xa9ba && code <= 0xa9bb) ||
        code === 0xa9bc ||
        (code >= 0xa9bd && code <= 0xa9c0) ||
        (code >= 0xa9d0 && code <= 0xa9d9) ||
        code === 0xa9e5 ||
        (code >= 0xa9f0 && code <= 0xa9f9) ||
        (code >= 0xaa29 && code <= 0xaa2e) ||
        (code >= 0xaa2f && code <= 0xaa30) ||
        (code >= 0xaa31 && code <= 0xaa32) ||
        (code >= 0xaa33 && code <= 0xaa34) ||
        (code >= 0xaa35 && code <= 0xaa36) ||
        code === 0xaa43 ||
        code === 0xaa4c ||
        code === 0xaa4d ||
        (code >= 0xaa50 && code <= 0xaa59) ||
        code === 0xaa7b ||
        code === 0xaa7c ||
        code === 0xaa7d ||
        code === 0xaab0 ||
        (code >= 0xaab2 && code <= 0xaab4) ||
        (code >= 0xaab7 && code <= 0xaab8) ||
        (code >= 0xaabe && code <= 0xaabf) ||
        code === 0xaac1 ||
        code === 0xaaeb ||
        (code >= 0xaaec && code <= 0xaaed) ||
        (code >= 0xaaee && code <= 0xaaef) ||
        code === 0xaaf5 ||
        code === 0xaaf6 ||
        (code >= 0xabe3 && code <= 0xabe4) ||
        code === 0xabe5 ||
        (code >= 0xabe6 && code <= 0xabe7) ||
        code === 0xabe8 ||
        (code >= 0xabe9 && code <= 0xabea) ||
        code === 0xabec ||
        code === 0xabed ||
        (code >= 0xabf0 && code <= 0xabf9) ||
        code === 0xfb1e ||
        (code >= 0xfe00 && code <= 0xfe0f) ||
        (code >= 0xfe20 && code <= 0xfe2f) ||
        (code >= 0xfe33 && code <= 0xfe34) ||
        (code >= 0xfe4d && code <= 0xfe4f) ||
        (code >= 0xff10 && code <= 0xff19) ||
        code === 0xff3f ||
        code === 0x101fd ||
        code === 0x102e0 ||
        (code >= 0x10376 && code <= 0x1037a) ||
        (code >= 0x104a0 && code <= 0x104a9) ||
        (code >= 0x10a01 && code <= 0x10a03) ||
        (code >= 0x10a05 && code <= 0x10a06) ||
        (code >= 0x10a0c && code <= 0x10a0f) ||
        (code >= 0x10a38 && code <= 0x10a3a) ||
        code === 0x10a3f ||
        (code >= 0x10ae5 && code <= 0x10ae6) ||
        code === 0x11000 ||
        code === 0x11001 ||
        code === 0x11002 ||
        (code >= 0x11038 && code <= 0x11046) ||
        (code >= 0x11066 && code <= 0x1106f) ||
        (code >= 0x1107f && code <= 0x11081) ||
        code === 0x11082 ||
        (code >= 0x110b0 && code <= 0x110b2) ||
        (code >= 0x110b3 && code <= 0x110b6) ||
        (code >= 0x110b7 && code <= 0x110b8) ||
        (code >= 0x110b9 && code <= 0x110ba) ||
        (code >= 0x110f0 && code <= 0x110f9) ||
        (code >= 0x11100 && code <= 0x11102) ||
        (code >= 0x11127 && code <= 0x1112b) ||
        code === 0x1112c ||
        (code >= 0x1112d && code <= 0x11134) ||
        (code >= 0x11136 && code <= 0x1113f) ||
        code === 0x11173 ||
        (code >= 0x11180 && code <= 0x11181) ||
        code === 0x11182 ||
        (code >= 0x111b3 && code <= 0x111b5) ||
        (code >= 0x111b6 && code <= 0x111be) ||
        (code >= 0x111bf && code <= 0x111c0) ||
        (code >= 0x111ca && code <= 0x111cc) ||
        (code >= 0x111d0 && code <= 0x111d9) ||
        (code >= 0x1122c && code <= 0x1122e) ||
        (code >= 0x1122f && code <= 0x11231) ||
        (code >= 0x11232 && code <= 0x11233) ||
        code === 0x11234 ||
        code === 0x11235 ||
        (code >= 0x11236 && code <= 0x11237) ||
        code === 0x1123e ||
        code === 0x112df ||
        (code >= 0x112e0 && code <= 0x112e2) ||
        (code >= 0x112e3 && code <= 0x112ea) ||
        (code >= 0x112f0 && code <= 0x112f9) ||
        (code >= 0x11300 && code <= 0x11301) ||
        (code >= 0x11302 && code <= 0x11303) ||
        code === 0x1133c ||
        (code >= 0x1133e && code <= 0x1133f) ||
        code === 0x11340 ||
        (code >= 0x11341 && code <= 0x11344) ||
        (code >= 0x11347 && code <= 0x11348) ||
        (code >= 0x1134b && code <= 0x1134d) ||
        code === 0x11357 ||
        (code >= 0x11362 && code <= 0x11363) ||
        (code >= 0x11366 && code <= 0x1136c) ||
        (code >= 0x11370 && code <= 0x11374) ||
        (code >= 0x11435 && code <= 0x11437) ||
        (code >= 0x11438 && code <= 0x1143f) ||
        (code >= 0x11440 && code <= 0x11441) ||
        (code >= 0x11442 && code <= 0x11444) ||
        code === 0x11445 ||
        code === 0x11446 ||
        (code >= 0x11450 && code <= 0x11459) ||
        (code >= 0x114b0 && code <= 0x114b2) ||
        (code >= 0x114b3 && code <= 0x114b8) ||
        code === 0x114b9 ||
        code === 0x114ba ||
        (code >= 0x114bb && code <= 0x114be) ||
        (code >= 0x114bf && code <= 0x114c0) ||
        code === 0x114c1 ||
        (code >= 0x114c2 && code <= 0x114c3) ||
        (code >= 0x114d0 && code <= 0x114d9) ||
        (code >= 0x115af && code <= 0x115b1) ||
        (code >= 0x115b2 && code <= 0x115b5) ||
        (code >= 0x115b8 && code <= 0x115bb) ||
        (code >= 0x115bc && code <= 0x115bd) ||
        code === 0x115be ||
        (code >= 0x115bf && code <= 0x115c0) ||
        (code >= 0x115dc && code <= 0x115dd) ||
        (code >= 0x11630 && code <= 0x11632) ||
        (code >= 0x11633 && code <= 0x1163a) ||
        (code >= 0x1163b && code <= 0x1163c) ||
        code === 0x1163d ||
        code === 0x1163e ||
        (code >= 0x1163f && code <= 0x11640) ||
        (code >= 0x11650 && code <= 0x11659) ||
        code === 0x116ab ||
        code === 0x116ac ||
        code === 0x116ad ||
        (code >= 0x116ae && code <= 0x116af) ||
        (code >= 0x116b0 && code <= 0x116b5) ||
        code === 0x116b6 ||
        code === 0x116b7 ||
        (code >= 0x116c0 && code <= 0x116c9) ||
        (code >= 0x1171d && code <= 0x1171f) ||
        (code >= 0x11720 && code <= 0x11721) ||
        (code >= 0x11722 && code <= 0x11725) ||
        code === 0x11726 ||
        (code >= 0x11727 && code <= 0x1172b) ||
        (code >= 0x11730 && code <= 0x11739) ||
        (code >= 0x118e0 && code <= 0x118e9) ||
        (code >= 0x11a01 && code <= 0x11a06) ||
        (code >= 0x11a07 && code <= 0x11a08) ||
        (code >= 0x11a09 && code <= 0x11a0a) ||
        (code >= 0x11a33 && code <= 0x11a38) ||
        code === 0x11a39 ||
        (code >= 0x11a3b && code <= 0x11a3e) ||
        code === 0x11a47 ||
        (code >= 0x11a51 && code <= 0x11a56) ||
        (code >= 0x11a57 && code <= 0x11a58) ||
        (code >= 0x11a59 && code <= 0x11a5b) ||
        (code >= 0x11a8a && code <= 0x11a96) ||
        code === 0x11a97 ||
        (code >= 0x11a98 && code <= 0x11a99) ||
        code === 0x11c2f ||
        (code >= 0x11c30 && code <= 0x11c36) ||
        (code >= 0x11c38 && code <= 0x11c3d) ||
        code === 0x11c3e ||
        code === 0x11c3f ||
        (code >= 0x11c50 && code <= 0x11c59) ||
        (code >= 0x11c92 && code <= 0x11ca7) ||
        code === 0x11ca9 ||
        (code >= 0x11caa && code <= 0x11cb0) ||
        code === 0x11cb1 ||
        (code >= 0x11cb2 && code <= 0x11cb3) ||
        code === 0x11cb4 ||
        (code >= 0x11cb5 && code <= 0x11cb6) ||
        (code >= 0x11d31 && code <= 0x11d36) ||
        code === 0x11d3a ||
        (code >= 0x11d3c && code <= 0x11d3d) ||
        (code >= 0x11d3f && code <= 0x11d45) ||
        code === 0x11d47 ||
        (code >= 0x11d50 && code <= 0x11d59) ||
        (code >= 0x16a60 && code <= 0x16a69) ||
        (code >= 0x16af0 && code <= 0x16af4) ||
        (code >= 0x16b30 && code <= 0x16b36) ||
        (code >= 0x16b50 && code <= 0x16b59) ||
        (code >= 0x16f51 && code <= 0x16f7e) ||
        (code >= 0x16f8f && code <= 0x16f92) ||
        (code >= 0x1bc9d && code <= 0x1bc9e) ||
        (code >= 0x1d165 && code <= 0x1d166) ||
        (code >= 0x1d167 && code <= 0x1d169) ||
        (code >= 0x1d16d && code <= 0x1d172) ||
        (code >= 0x1d17b && code <= 0x1d182) ||
        (code >= 0x1d185 && code <= 0x1d18b) ||
        (code >= 0x1d1aa && code <= 0x1d1ad) ||
        (code >= 0x1d242 && code <= 0x1d244) ||
        (code >= 0x1d7ce && code <= 0x1d7ff) ||
        (code >= 0x1da00 && code <= 0x1da36) ||
        (code >= 0x1da3b && code <= 0x1da6c) ||
        code === 0x1da75 ||
        code === 0x1da84 ||
        (code >= 0x1da9b && code <= 0x1da9f) ||
        (code >= 0x1daa1 && code <= 0x1daaf) ||
        (code >= 0x1e000 && code <= 0x1e006) ||
        (code >= 0x1e008 && code <= 0x1e018) ||
        (code >= 0x1e01b && code <= 0x1e021) ||
        (code >= 0x1e023 && code <= 0x1e024) ||
        (code >= 0x1e026 && code <= 0x1e02a) ||
        (code >= 0x1e8d0 && code <= 0x1e8d6) ||
        (code >= 0x1e944 && code <= 0x1e94a) ||
        (code >= 0x1e950 && code <= 0x1e959) ||
        (code >= 0xe0100 && code <= 0xe01ef)
    )
}
