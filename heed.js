on('ready', function() {
    on('chat:message', function(msg) {
        if (msg.type === 'general' && msg.content && msg.rolltemplate === 'default') {
            
            log(`Received message content: ${msg.content}`);
            
            if (msg.content.includes('rolled an attack with')) {

                let charNameMatch = msg.content.match(/{{name=(.*?)}}/);
                let rollMatch = msg.content.match(/{{Strength:=\$\[\[(\d+)\]\]}}/);
                let weaponIndexMatch = msg.content.match(/\(WeaponIndex=(\d)\)/);
    
                if (charNameMatch && rollMatch && weaponIndexMatch) {
    
                    let charName = charNameMatch[1];
                    let rollIndex = parseInt(rollMatch[1], 10);
                    let weaponIndex = weaponIndexMatch[1];
                    
                    log('weaponIndex = ' + weaponIndex);
    
                    if (msg.inlinerolls && msg.inlinerolls[rollIndex]) {
                        let roll = msg.inlinerolls[rollIndex].results.total;
                        
                        let character = findObjs({
                            _type: "character",
                            name: charName
                        })[0];
                        
                        if (character) {
                            let weapon = getAttrByName(character.id, `attack_${weaponIndex}_desc`);
                            
                            log('weapon = ' + weapon);

                            let resultTable = weapons[weapon];
                            
                            let keys = Object.keys(resultTable).map(Number);
                            let maxKey = Math.max(...keys);
                            
                            log('maxKey = ' + maxKey);
                            
                            if (roll < 1) {
                                roll = 1;
                            } else if (roll > maxKey) {
                                log('Roll of ' + roll + ' was higher than ' + maxKey)
                                roll = maxKey;
                            }
                            
                            let result = resultTable[roll];
    
                            sendChat("Result", result);
                        } else {
                            sendChat("API", `/w gm Character not found: ${charName}`);
                        }
                    } else {
                        sendChat("API", `/w gm Could not retrieve the roll result for: ${msg.content}`);
                    }
                } else {
                    sendChat("API", `/w gm Could not parse the roll template content: ${msg.content}`);
                }
            }
        }
    });
});

const weapons = {
    "shortsword": {
        1: "No damage",
        2: "1 piercing",
        3: "2 piercing",
        4: "3 piercing",
        5: "4 piercing",
        6: "5 piercing",
        7: "6 piercing + <i>roll again</i>",
    },
    "axe": {
        1: "No damage",
        2: "1 slashing",
        3: "2 slashing",
        4: "3 slashing",
        5: "4 slashing",
        6: "5 slashing",
        7: "6 slashing + <i>Dismemberment</i>",
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
