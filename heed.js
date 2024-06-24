on('ready', function() {
    on('chat:message', function(msg) {
        if (msg.type === 'api' && msg.content.startsWith('!rollattack')) {
            let rollTemplateContent = msg.content.replace('!rollattack ', '');
            
            let charNameMatch = rollTemplateContent.match(/{{name=(.*?) rolled}}/);
            let strengthRollMatch = rollTemplateContent.match(/{{Strength=\[\[(.*?)\]\]}}/);

            if (charNameMatch && strengthRollMatch) {
                let charName = charNameMatch[1];
                let strengthRoll = strengthRollMatch[1];

                sendChat("API", `${charName} made a strength roll: ${strengthRoll}`);
            } else {
                sendChat("API", `Could not parse the roll template content: ${rollTemplateContent}`);
            }
        }
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
