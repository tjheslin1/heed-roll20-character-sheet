on('ready', function() {
    
    on('change:attribute', (obj) => {
        if (obj.get('name') === 'attack_1_clicked') {
            sendChat("Tom", "clickeded");
        };
    });
});
