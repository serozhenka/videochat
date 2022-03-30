import random
import time
import json
from django.shortcuts import render
from decouple import config
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
from .models import RoomMember
from django.views.decorators.csrf import csrf_exempt

def get_token(request):
    appId = '0c313de6efdc4ded9e4901752859b779'
    appCertificate = config('appCertificate')
    channelName = request.GET.get('channelName')
    uid = random.randint(1, 230)
    role = 1
    expirationTime = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTime

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token': token, 'uid': uid}, safe=False)

@csrf_exempt
def create_member(request):
    data = json.loads(request.body)
    member, created = RoomMember.objects.get_or_create(
        name=data['name'],
        uid=data['uid'],
        room_name=data['room_name'],
    )
    return JsonResponse({'name': data['name']}, safe=False)

def get_member(request):
    uid = request.GET.get('uid')
    room_name = request.GET.get('room_name')
    member = RoomMember.objects.get(
        uid=uid,
        room_name=room_name,
    )
    return JsonResponse({'name': member.name}, safe=False)

@csrf_exempt
def delete_member(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(
        uid=data['uid'],
        room_name=data['room_name'],
        name=data['name'],
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)

def lobby(request):
    return render(request, 'base/lobby.html', context={})

def room_page(request):
    return render(request, 'base/room.html', context={})
