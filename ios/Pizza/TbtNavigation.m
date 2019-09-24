//
//  TbtNavigation.m
//  Pizza
//
//  Created by Admin on 09/09/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_REMAP_MODULE(MapboxNavigation, TbtNavigation, NSObject)
RCT_EXTERN_METHOD(
                  navigate: (double)org_lat
                  org_long: (double)org_long
                  dest_lat: (double)dest_lat
                  dest_long:(double)dest_long)
@end
