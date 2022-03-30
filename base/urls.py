from django.urls import path
from . import views

urlpatterns = [
    path('', views.lobby, name='lobby'),
    path('room/', views.room_page, name='room'),
    path('get_token/', views.get_token, name='get-token'),
    path('create-member/', views.create_member, name='create_member'),
    path('get-member/', views.get_member, name='get-member'),
    path('delete-member/', views.delete_member, name='delete-member'),
]