from django.urls import path
from . import views_noc

urlpatterns = [
    path("snapshot/", views_noc.noc_snapshot,    name="noc-snapshot"),
    path("problems/", views_noc.active_problems,  name="noc-problems"),
    path("traffic/",  views_noc.traffic_series,   name="noc-traffic"),
]
