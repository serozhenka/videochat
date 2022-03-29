from django.shortcuts import render

def lobby(request):
    return render(request, 'base/lobby.html', context={})

def room_page(request, room_id):
    return render(request, 'base/room.html', context={})
