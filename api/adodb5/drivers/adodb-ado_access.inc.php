<?php
/*
@version   v5.20.17  31-Mar-2020
@copyright (c) 2000-2013 John Lim (jlim#natsoft.com). All rights reserved.
@copyright (c) 2014      Damien Regad, Mark Newnham and the ADOdb community
Released under both BSD license and Lesser GPL library license.
Whenever there is any discrepancy between the two licenses,
the BSD license will take precedence. See License.txt.
Set tabs to 4 for best viewing.

  Latest version is available at http://adodb.org/

	Microsoft Access ADO data driver. Requires ADO and ODBC. Works only on MS Windows.
*/

// security - hide paths
if (!defined('ADODB_DIR')) die();

if (!defined('_ADODB_ADO_LAYER')) {
	if (PHP_VERSION >= 5) include(ADODB_DIR."/drivers/adodb-ado5.inc.php");
	else include(ADODB_DIR."/drivers/adodb-ado.inc.php");
}

class  ADODB_ado_access extends ADODB_ado {
	var $databaseType = 'ado_access';
	var $hasInsertID = true; //***
	var $concat_operator = '&'; //***
	var $hasTop = 'top'; // support mssql SELECT TOP 10 * FROM TABLE
	var $fmtDate = "#Y-m-d#";
	var $fmtTimeStamp = "#Y-m-d h:i:sA#";// note no comma
	var $sysDate = "FORMAT(NOW,'yyyy-mm-dd')";
	var $sysTimeStamp = 'NOW';
	var $upperCase = 'ucase';

	function __construct()
	{
		parent::__construct();
	}

	//***
	function _insertid()
	{
		return $this->GetOne('select @@IDENTITY');
	}

	// Fix SELECT DISTINCT //***
	function SelectLimit($sql, $nrows=-1, $offset=-1, $inputarr=false, $secs2cache=0)
	{
		if ($this->hasTop && $nrows > 0) {
			if ($offset <= 0) {
				if (preg_match('/^\s*select\s+distinct\s/i', $sql))
					$sql = 'select ' . $this->hasTop . ' ' . ((integer)$nrows) . ' * from (' . $sql . ')';
				else
					$sql = preg_replace('/(^\s*select\s+(distinctrow)?)/i', '\\1 ' . $this->hasTop . ' ' . ((integer)$nrows) . ' ', $sql);
				if ($secs2cache != 0) {
					$ret = $this->CacheExecute($secs2cache, $sql, $inputarr);
				} else {
					$ret = $this->Execute($sql, $inputarr);
				}
				return $ret;
			} else {
				$nn = $nrows + $offset;
				if (preg_match('/^\s*select\s+distinct\s/i', $sql))
					$sql = 'select ' . $this->hasTop . ' ' . $nn . ' * from (' . $sql . ')';
				else
					$sql = preg_replace('/(^\s*select\s+(distinctrow)?)/i', '\\1 ' . $this->hasTop . ' ' . $nn . ' ', $sql);
			}
		}

		// if $offset>0, we want to skip rows, and $ADODB_COUNTRECS is set, we buffer rows
		// 0 to offset-1 which will be discarded anyway. So we disable $ADODB_COUNTRECS.
		global $ADODB_COUNTRECS;

		$savec = $ADODB_COUNTRECS;
		$ADODB_COUNTRECS = false;

		if ($secs2cache != 0) {
			$rs = $this->CacheExecute($secs2cache, $sql, $inputarr);
		} else {
			$rs = $this->Execute($sql, $inputarr);
		}

		$ADODB_COUNTRECS = $savec;
		if ($rs && !$rs->EOF) {
			$rs = $this->_rs2rs($rs, $nrows, $offset);
		}

		return $rs;
	}

	/*function BeginTrans() { return false;}

	function CommitTrans() { return false;}

	function RollbackTrans() { return false;}*/

}


class  ADORecordSet_ado_access extends ADORecordSet_ado {

	var $databaseType = "ado_access";

	function __construct($id,$mode=false)
	{
		return parent::__construct($id,$mode);
	}
}
