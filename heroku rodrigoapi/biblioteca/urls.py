from django.urls import path

from . import views

urlpatterns = [
    path('',views.biblioteca_list),
    path('<int:pk>',views.biblioteca_detail)
]