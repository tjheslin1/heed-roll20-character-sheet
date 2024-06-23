on('ready', function() {
    
    on('change:attribute', (obj) => {
        if (obj.get('name') === 'attack_1_clicked') {
            let characterId = obj.get('_characterid');
            // let weapon = obj.get('attack_1_desc');
            
            let attr = findObjs({
                name: 'attack_1_desc',
                _type: 'attribute',
                _characterid: characterId
            })[0];
            
            console.log(attr);
            
            let att = null;
            if (attr) {
                att = attr.get("current");
            }

            sendChat(characterId, "clickeded " + obj.attack_1_desc + " " + att);
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
