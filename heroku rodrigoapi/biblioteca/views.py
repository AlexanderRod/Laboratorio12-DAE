from django.db.models import manager
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.http import HttpResponse
from rest_framework.response import Response

from .models import Biblioteca
from .serializers import BibliotecaSerializer

class JSONResponse(HttpResponse):
    def __init__(self,data,**kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse,self).__init__(content,**kwargs)
        
        

# Create your views here.
@csrf_exempt
def biblioteca_list(request):

    if request.method == 'GET':
        biblioteca = Biblioteca.objects.all()
        serializer = BibliotecaSerializer(biblioteca,many=True)
        return JSONResponse(serializer.data)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = BibliotecaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data,status=201)
        return JSONResponse(serializer.errors,status=400)
    
@csrf_exempt
def biblioteca_detail(request,pk):
    try:
        biblioteca = Biblioteca.objects.get(pk=pk)
    except Biblioteca.DoesNotExist:
        return HttpResponse(status=404)
    
    if request.method=='GET':
        serializer = BibliotecaSerializer(biblioteca)
        return JSONResponse(serializer.data)
    
    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = BibliotecaSerializer(biblioteca,data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data)
        return JSONResponse(serializer.errors,status=400)
    elif request.method == 'DELETE':
        biblioteca.delete()
        return HttpResponse(status=204)
