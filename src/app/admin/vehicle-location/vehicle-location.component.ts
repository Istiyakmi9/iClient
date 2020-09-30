import { Component, OnInit, ViewChild } from "@angular/core";
import { MapInfoWindow, MapMarker, GoogleMap } from "@angular/google-maps";

@Component({
  selector: "app-vehicle-location",
  templateUrl: "./vehicle-location.component.html",
  styleUrls: ["./vehicle-location.component.scss"],
})
export class VehicleLocationComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: "hybrid",
    maxZoom: 15,
    minZoom: 8,
  };
  markers = [];
  currLoc: google.maps.LatLngLiteral;
  infoContent = "";

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.currLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.markers.push({
        position: {
          lat: this.center.lat,
          lng: this.center.lng,
        },
        label: {
          color: "white",
          text: "Your Location",
        },
        title: "Current Location ",
        info: "Current Location",
      });
    });
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++;
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--;
  }

  click(event: google.maps.MouseEvent) {
    console.log(event);
    this.markers.push({
      position: {
        lat: event.latLng.toJSON().lat,
        lng: event.latLng.toJSON().lng,
      },
      label: {
        color: "white",
        text: "Marker label " + this.markers.length,
      },
      title: "Marker title " + this.markers.length,
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
    });
  }

  logCenter() {
    console.log(this.map.getCenter().toJSON());
    this.map.panTo(this.currLoc);
  }

  addMarker() {
    this.markers.push({
      position: {
        lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
        lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
      },
      label: {
        color: "white",
        text: "Marker label " + (this.markers.length + 1),
      },
      title: "Marker title " + (this.markers.length + 1),
      info: "Marker info " + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
    });
  }

  openInfo(marker: MapMarker, content) {
    this.infoContent = content;
    this.info.open(marker);
  }
}
