import random
import time
from django.shortcuts import render
from decouple import config
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder

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

def lobby(request):
    return render(request, 'base/lobby.html', context={})

def room_page(request):
    return render(request, 'base/room.html', context={})
