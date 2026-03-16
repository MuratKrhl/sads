from django.urls import path, include

urlpatterns = [
    path("api/inventory/",  include("django_core.dynatrace.urls")),
    path("api/noc/",        include("django_core.dynatrace.urls_noc")),
]
