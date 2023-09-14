from django.urls import path

from .views import create_room

app_name = 'chat'

urlpatterns =  [
    path('api/create-room/<str:uuid>/', create_room, name="create-room")
]