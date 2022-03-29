from django.urls import path
from . import views

urlpatterns = [
    path('', views.lobby, name='lobby'),
    path('room/<str:room_id>/', views.room_page, name='room'),
]