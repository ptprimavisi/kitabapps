<?php
/**
 * @version   v5.20.17  31-Mar-2020
 * @copyright (c) 2000-2013 John Lim (jlim#natsoft.com). All rights reserved.
 * @copyright (c) 2014      Damien Regad, Mark Newnham and the ADOdb community
 * Released under both BSD license and Lesser GPL library license.
 * Whenever there is any discrepancy between the two licenses,
 * the BSD license will take precedence.
 *
 * Set tabs to 4 for best viewing.
 *
 * Latest version is available at http://adodb.org/
 *
 * Oracle 8.0.5 driver
*/

// security - hide paths
if (!defined('ADODB_DIR')) die();

include_once(ADODB_DIR.'/drivers/adodb-oci8.inc.php');

class ADODB_oci805 extends ADODB_oci8 {
	var $databaseType = "oci805";
	var $connectSID = true;
	var $isOracle12; //***

	//*** function SelectLimit($sql,$nrows=-1,$offset=-1, $inputarr=false,$secs2cache=0)
	// {
	// 	// seems that oracle only supports 1 hint comment in 8i
	// 	if (strpos($sql,'/*+') !== false)
	// 		$sql = str_replace('/*+ ','/*+FIRST_ROWS ',$sql);
	// 	else
	// 		$sql = preg_replace('/^[ \t\n]*select/i','SELECT /*+FIRST_ROWS*/',$sql);

	// 	/*
	// 		The following is only available from 8.1.5 because order by in inline views not
	// 		available before then...
	// 		http://www.jlcomp.demon.co.uk/faq/top_sql.html
	// 	if ($nrows > 0) {
	// 		if ($offset > 0) $nrows += $offset;
	// 		$sql = "select * from ($sql) where rownum <= $nrows";
	// 		$nrows = -1;
	// 	}
	// 	*/

	// 	return ADOConnection::SelectLimit($sql,$nrows,$offset,$inputarr,$secs2cache);
	// }

	// Check version
	function checkVersion() { //***
		if (!isset($this->isOracle12)) { // Check if Oracle >= 12.1
			if (preg_match('/^\d+\.\d+/', $this->ServerInfo()["compat"], $m))
				$this->isOracle12 = (floatval($m[0]) >= 12.1);
			else
				$this->isOracle12 = false;
		}
	}

	// SelectLimit for Oracle >= 12.1 //***
	function SelectLimit($sql, $nrows = -1, $offset = -1, $inputarr = false, $secs2cache = 0) {
		if ($this->isOracle12) {
			if ($offset > -1)
				$sql .= " OFFSET " . $offset . " ROWS";
			if ($nrows > 0)
				$sql .= " FETCH NEXT " . $nrows . " ROWS ONLY";
			if ($secs2cache > 0)
				$rs = $this->CacheExecute($secs2cache, $sql, $inputarr);
			else
				$rs = $this->Execute($sql, $inputarr);
			return $rs;
		} else {
			return parent::SelectLimit($sql, $nrows, $offset, $inputarr, $secs2cache);
		}
	}

	function Execute($sql, $inputarr = false) { //***
		if (preg_match('/^SELECT\\s/i', $sql)) {
			$countrecs = $GLOBALS["ADODB_COUNTRECS"];
			$GLOBALS["ADODB_COUNTRECS"] = true;
			$ret = parent::Execute($sql, $inputarr);
			$GLOBALS["ADODB_COUNTRECS"] = $countrecs;
		} else {
			$ret = parent::Execute($sql, $inputarr);
		}
		if ($ret instanceof ADORecordset_oci805 && $ret->_numOfRows < 0 && !$GLOBALS["ADODB_COUNTRECS"] &&
			preg_match('/^SELECT\\s/i', $sql) && // SELECT statement
			!preg_match('/where rownum <= :adodb_offset$/', $sql)) { // Not using ADOConnection::SelectLimit
			$rs = parent::Execute($sql, $inputarr);
			$cnt = 0;
			while (!$rs->EOF) {
				$cnt++;
				$rs->MoveNext();
			}
			$rs->Close();
			$ret->_numOfRows = $cnt;
		}
		return $ret;
	}
}

class ADORecordset_oci805 extends ADORecordset_oci8 {
	var $databaseType = "oci805";
	function __construct($id,$mode=false)
	{
		parent::__construct($id,$mode);
	}
}
