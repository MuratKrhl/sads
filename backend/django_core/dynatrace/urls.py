from django.urls import path
from . import views

urlpatterns = [
    path("hosts/",        views.host_summary,        name="inventory-hosts"),
    path("applications/", views.application_summary,  name="inventory-apps"),
    path("kdb/",          views.kdb_certificates,     name="inventory-kdb"),
    path("java/",         views.java_certificates,    name="inventory-java"),
    path("all/",          views.inventory_all,         name="inventory-all"),
]
