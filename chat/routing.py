from django.urls import path
from . import consumers

websockets_urlpatterns = [
    path('ws/<str:room_name>/', consumers.AsyncWebsocketConsumer.as_asgi())
]
