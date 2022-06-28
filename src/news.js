const news = [
    'I need to add news messages.',
    'You\'re almost there!',
    'Also try out Antreematter Dimensions!',
    'Hello there.',
    'new phone who dis',
    'AAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'Please do not disable the news.',
    'help i\'m stuck making news tickers in a factory',
    'Infinity is a long way to go.'
];

let newsX = 100;
function updateNews() {
    $('div.news-ticker span').css('transform', `translateX(${newsX}%)`);
    newsX -= 0.35;
    if(newsX < -100) {
        newsX = 100;
        $('div.news-ticker span').text(news[Math.floor(Math.random() * news.length)]);
    }
    requestAnimationFrame(updateNews);
}

$(() => {
    $('div.news-ticker span').text(news[Math.floor(Math.random() * news.length)]);
    requestAnimationFrame(updateNews);
});
