import { DbApp } from './dbapp';
import { UserData } from './user-data';
import { DbTable } from './dbtable';
import { DbRecord } from './dbrecord';
import { DbField, DbFile } from './dbfield';
import { LocalDatePipe } from './localdate.pipe';
import { LocalNumberPipe } from './localnumber.pipe';
import { LocalCurrencyPipe } from './localcurrency.pipe';
import { LocalPercentPipe } from './localpercent.pipe';
import { AuthFilePipe } from './authfile.pipe';
import { LocaleService } from './locale.service';
import { History } from './dbapp.history';
import { Settings } from './dbapp.settings';
import { date, time, creditCard, float, integer, usphone, uszip, usssn, guid, mustMatch, files } from './dbapp.validators';
import { kitab } from './kitab';
import { kitab_detil } from './kitab_detil';
import { _user } from './_user';
import { userlevelpermissions } from './userlevelpermissions';
import { userlevels } from './userlevels';
import { v_kitab } from './v_kitab';

// Classes and pipes
export {
	DbApp,
	UserData,
	Settings,
	DbTable,
	DbRecord,
	DbField,
	DbFile,
	LocalDatePipe,
	LocalNumberPipe,
	LocalCurrencyPipe,
	LocalPercentPipe,
	AuthFilePipe,
	LocaleService,
	History,
	kitab,
	kitab_detil,
	_user,
	userlevelpermissions,
	userlevels,
	v_kitab
};

// Validators
export const DbAppValidators = {
	creditCard,
	date,
	time,
	integer,
	float,
	usphone,
	uszip,
	usssn,
	guid,
	mustMatch,
	files
}