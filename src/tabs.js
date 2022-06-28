var lastTabShown = '';

function showTab(tab) {
    document.querySelectorAll('.tab').forEach(element => {
        element.style.display = 'none';
    });
    document.querySelector(`.tab-${tab}`).style.display = 'block';
    lastTabShown = tab;
}

document.addEventListener('DOMContentLoaded', function() {
    showTab('generators');
});
