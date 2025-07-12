/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.rasp.app.resource;

import platform.webservice.BasePossibleValue;
import platform.webservice.Enum;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
public class Program extends BasePossibleValue {
		public static String ID_btech_cse = "btech_cse";
		public static String NAME_btech_cse = "btech_cse";
		public static String ID_btech_ece = "btech_ece";
		public static String NAME_btech_ece = "btech_ece";
		public static String ID_btech_aids = "btech_aids";
		public static String NAME_btech_aids = "btech_aids";
		public static String ID_Integrated_Master_of_Technology_CSE = "Integrated Master of Technology CSE";
		public static String NAME_Integrated_Master_of_Technology_CSE = "Integrated Master of Technology CSE";
		public static String ID_Integrated_Master_of_Technology_ECE = "Integrated Master of Technology ECE";
		public static String NAME_Integrated_Master_of_Technology_ECE = "Integrated Master of Technology ECE";
		public Program() {super("PROGRAM");}
		protected void populate() {
 			add(new Enum(ID_btech_cse,NAME_btech_cse));
 			add(new Enum(ID_btech_ece,NAME_btech_ece));
 			add(new Enum(ID_btech_aids,NAME_btech_aids));
 			add(new Enum(ID_Integrated_Master_of_Technology_CSE,NAME_Integrated_Master_of_Technology_CSE));
 			add(new Enum(ID_Integrated_Master_of_Technology_ECE,NAME_Integrated_Master_of_Technology_ECE));
		}
}