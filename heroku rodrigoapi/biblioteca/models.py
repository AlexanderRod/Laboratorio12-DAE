from django.db import models

# Create your models here.
class Biblioteca(models.Model):
    FICCION = 'Ficcion'
    BIOGRAFICA = 'Biografica'
    CIENCIA = 'Ciencia'
    DRAMATICO = 'Dramatico'
    ACCION = 'Accion'
    CLASICA = 'Clasica'

    CATEGORIES_CHOICES = (
        (FICCION, 'ficcion'),
        (BIOGRAFICA, 'biografica'),
        (CIENCIA, 'ciencia'),
        (DRAMATICO, 'dramatico'),
        (ACCION, 'accion'),
        (CLASICA, 'clasica'),
    )

    name = models.CharField(max_length=100)
    release_date = models.DateField()
    numerospag  = models.IntegerField(default=0)
    category = models.CharField(max_length=10,choices=CATEGORIES_CHOICES)
    
    def __str__(self):
        return self.name
