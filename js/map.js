// Configuração e inicialização do Google Maps
let map;
let markers = [];

function initMap() {
    // Centralizar o mapa no Brasil
    const brasilCenter = { lat: -15.7801, lng: -47.9292 };
    
    map = new google.maps.Map(document.getElementById('shows-map'), {
        zoom: 4,
        center: brasilCenter,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"lightness": -80}]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#d59563"}]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#d59563"}]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{"color": "#263c3f"}]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#6b9a76"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#38414e"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#212a37"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9ca5b3"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#1f2835"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#f3d19c"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#17263c"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#515c6d"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [{"lightness": -20}]
            }
        ]
    });

    // Adicionar marcadores para cada show
    addShowMarkers();

    // Adicionar listeners para os botões do mapa
    setupMapButtons();
}

function addShowMarkers() {
    // Limpar marcadores existentes
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // Coletar todos os shows
    const showCards = document.querySelectorAll('.show-card');
    
    showCards.forEach(card => {
        const mapButton = card.querySelector('.map-button');
        const coords = mapButton.dataset.coords.split(',');
        const venue = card.querySelector('h3').textContent;
        const location = card.querySelector('.location').textContent.trim();
        const date = formatShowDate(card);

        const marker = new google.maps.Marker({
            position: { 
                lat: parseFloat(coords[0]), 
                lng: parseFloat(coords[1])
            },
            map: map,
            title: venue,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#9400D3',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2
            },
            animation: google.maps.Animation.DROP
        });

        // Adicionar InfoWindow
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <h3>${venue}</h3>
                    <p>${location}</p>
                    <p>${date}</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    });
}

function formatShowDate(card) {
    const day = card.querySelector('.day').textContent;
    const month = card.querySelector('.month').textContent;
    const year = card.querySelector('.year').textContent;
    const time = card.querySelector('.time').textContent.trim();
    return `${day} ${month} ${year} - ${time}`;
}

function setupMapButtons() {
    document.querySelectorAll('.map-button').forEach((button, index) => {
        button.addEventListener('click', () => {
            const coords = button.dataset.coords.split(',');
            const position = { 
                lat: parseFloat(coords[0]), 
                lng: parseFloat(coords[1])
            };

            // Centralizar mapa no marcador
            map.panTo(position);
            map.setZoom(15);

            // Animar marcador
            markers[index].setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                markers[index].setAnimation(null);
            }, 2100);

            // Abrir InfoWindow
            const infoWindow = new google.maps.InfoWindow({
                content: markers[index].getTitle()
            });
            infoWindow.open(map, markers[index]);
        });
    });
}

// Inicializar mapa quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o elemento do mapa existe antes de inicializar
    if (document.getElementById('shows-map')) {
        // O callback initMap será chamado quando a API do Google Maps carregar
        window.initMap = initMap;
    }
});
