from django.urls import path
from . import views

urlpatterns = [
    path('', views.lobby, name='lobby'),
    path('room/', views.room_page, name='room'),
    path('get_token/', views.get_token, name='get-token'),
]