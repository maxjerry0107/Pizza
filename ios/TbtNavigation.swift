//
//  TbtNavigation.swift
//  Pizza
//
//  Created by Admin on 09/09/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import MapboxDirections
import MapboxCoreNavigation
import MapboxNavigation
@objc(TbtNavigation)
class TbtNavigation: NSObject {
  @objc
  func navigate(_ org_lat:Double, org_long org_long:Double, dest_lat dest_lat:Double, dest_long dest_long:Double) {
    let origin = Waypoint(coordinate: CLLocationCoordinate2D(latitude: org_lat, longitude: org_long), name: "Your place")
    let destination = Waypoint(coordinate: CLLocationCoordinate2D(latitude: dest_lat, longitude: dest_long), name: "Munchin Franks")
    let options = NavigationRouteOptions(waypoints: [origin, destination])
    Directions.shared.calculate(options) { (waypoints, routes, error) in
      guard let route = routes?.first else { return }
      let viewController = NavigationViewController(for: route)
      let appDelegate = UIApplication.shared.delegate
      appDelegate!.window!!.rootViewController!.present(viewController, animated: true, completion: nil)
    }
  }
}
