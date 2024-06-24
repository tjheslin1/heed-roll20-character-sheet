on('ready', function() {
    
    on('change:attribute', (obj) => {
        if (obj.get('name') === 'attack_1_clicked') {
            let characterId = obj.get('_characterid');
            
            let att = getAttribute('attack_1_desc', characterId)

            let characterName = getObj('character', characterId).get('name');

            sendChat(characterName, att);
        };
    });
});

const weapons = {
    "shortsword": {
        1: "No damage",
        2: "1",
        3: "2",
        4: "3",
        5: "4",
        6: "5",
        7: "6",
    }
};

function getAttribute(name, charId) {
    let attr = findObjs({
        name: name,
        _type: 'attribute',
        _characterid: charId
    })[0];

    let att = null;
    if (attr) {
        att = attr.get("current");
    }

    return att;
}
