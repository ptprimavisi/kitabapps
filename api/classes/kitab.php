<?php namespace PHPMaker2020\kitab; ?>
<?php

/**
 * Table class for kitab
 */
class kitab extends DbTable
{
	protected $SqlFrom = "";
	protected $SqlSelect = "";
	protected $SqlSelectList = "";
	protected $SqlWhere = "";
	protected $SqlGroupBy = "";
	protected $SqlHaving = "";
	protected $SqlOrderBy = "";
	public $UseSessionForListSql = TRUE;

	// Column CSS classes
	public $LeftColumnClass = "col-sm-2 col-form-label ew-label";
	public $RightColumnClass = "col-sm-10";
	public $OffsetColumnClass = "col-sm-10 offset-sm-2";
	public $TableLeftColumnClass = "w-col-2";

	// Export
	public $ExportDoc;

	// Fields
	public $id;
	public $judul;
	public $pengarang;
	public $keterangan;
	public $sampul;
	public $thn_terbit;
	public $tag;
	public $u_by;
	public $i_by;
	public $validasi_by;
	public $u_date;
	public $i_date;
	public $validasi_date;
	public $aktif;

	// Constructor
	public function __construct()
	{
		global $Language, $CurrentLanguage;
		parent::__construct();

		// Language object
		if (!isset($Language))
			$Language = new Language();
		$this->TableVar = 'kitab';
		$this->TableName = 'kitab';
		$this->TableType = 'TABLE';

		// Update Table
		$this->UpdateTable = "`kitab`";
		$this->Dbid = 'DB';
		$this->ExportAll = FALSE;
		$this->ExportPageBreakCount = 0; // Page break per every n record (PDF only)
		$this->ExportPageOrientation = "portrait"; // Page orientation (PDF only)
		$this->ExportPageSize = "a4"; // Page size (PDF only)
		$this->ExportExcelPageOrientation = ""; // Page orientation (PhpSpreadsheet only)
		$this->ExportExcelPageSize = ""; // Page size (PhpSpreadsheet only)
		$this->ExportWordPageOrientation = "portrait"; // Page orientation (PHPWord only)
		$this->ExportWordColumnWidth = NULL; // Cell width (PHPWord only)
		$this->DetailAdd = FALSE; // Allow detail add
		$this->DetailEdit = FALSE; // Allow detail edit
		$this->DetailView = FALSE; // Allow detail view
		$this->ShowMultipleDetails = FALSE; // Show multiple details
		$this->GridAddRowCount = 5;
		$this->AllowAddDeleteRow = TRUE; // Allow add/delete row
		$this->UserIDAllowSecurity = Config("DEFAULT_USER_ID_ALLOW_SECURITY"); // Default User ID allowed permissions
		$this->BasicSearch = new BasicSearch($this->TableVar);

		// id
		$this->id = new DbField('kitab', 'kitab', 'id', 'id', '`id`', '`id`', 3, 11, -1, FALSE, '`id`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->id->IsAutoIncrement = TRUE; // Autoincrement field
		$this->id->IsPrimaryKey = TRUE; // Primary key field
		$this->id->IsForeignKey = TRUE; // Foreign key field
		$this->id->Sortable = FALSE; // Allow sort
		$this->id->DefaultErrorMessage = $Language->phrase("IncorrectInteger");
		$this->fields['id'] = &$this->id;

		// judul
		$this->judul = new DbField('kitab', 'kitab', 'judul', 'judul', '`judul`', '`judul`', 200, 255, -1, FALSE, '`judul`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->judul->Sortable = FALSE; // Allow sort
		$this->fields['judul'] = &$this->judul;

		// pengarang
		$this->pengarang = new DbField('kitab', 'kitab', 'pengarang', 'pengarang', '`pengarang`', '`pengarang`', 200, 255, -1, FALSE, '`pengarang`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->pengarang->Sortable = FALSE; // Allow sort
		$this->fields['pengarang'] = &$this->pengarang;

		// keterangan
		$this->keterangan = new DbField('kitab', 'kitab', 'keterangan', 'keterangan', '`keterangan`', '`keterangan`', 200, 255, -1, FALSE, '`keterangan`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->keterangan->Sortable = FALSE; // Allow sort
		$this->fields['keterangan'] = &$this->keterangan;

		// sampul
		$this->sampul = new DbField('kitab', 'kitab', 'sampul', 'sampul', '`sampul`', '`sampul`', 200, 255, -1, TRUE, '`sampul`', FALSE, FALSE, FALSE, 'IMAGE', 'FILE');
		$this->sampul->Sortable = FALSE; // Allow sort
		$this->fields['sampul'] = &$this->sampul;

		// thn_terbit
		$this->thn_terbit = new DbField('kitab', 'kitab', 'thn_terbit', 'thn_terbit', '`thn_terbit`', '`thn_terbit`', 2, 6, -1, FALSE, '`thn_terbit`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->thn_terbit->Sortable = FALSE; // Allow sort
		$this->thn_terbit->DefaultErrorMessage = $Language->phrase("IncorrectInteger");
		$this->fields['thn_terbit'] = &$this->thn_terbit;

		// tag
		$this->tag = new DbField('kitab', 'kitab', 'tag', 'tag', '`tag`', '`tag`', 200, 255, -1, FALSE, '`tag`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->tag->Sortable = FALSE; // Allow sort
		$this->fields['tag'] = &$this->tag;

		// u_by
		$this->u_by = new DbField('kitab', 'kitab', 'u_by', 'u_by', '`u_by`', '`u_by`', 3, 11, -1, FALSE, '`u_by`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->u_by->Sortable = FALSE; // Allow sort
		$this->u_by->DefaultErrorMessage = $Language->phrase("IncorrectInteger");
		$this->fields['u_by'] = &$this->u_by;

		// i_by
		$this->i_by = new DbField('kitab', 'kitab', 'i_by', 'i_by', '`i_by`', '`i_by`', 3, 11, -1, FALSE, '`i_by`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->i_by->Sortable = FALSE; // Allow sort
		$this->i_by->DefaultErrorMessage = $Language->phrase("IncorrectInteger");
		$this->fields['i_by'] = &$this->i_by;

		// validasi_by
		$this->validasi_by = new DbField('kitab', 'kitab', 'validasi_by', 'validasi_by', '`validasi_by`', '`validasi_by`', 3, 11, -1, FALSE, '`validasi_by`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->validasi_by->Sortable = FALSE; // Allow sort
		$this->validasi_by->DefaultErrorMessage = $Language->phrase("IncorrectInteger");
		$this->fields['validasi_by'] = &$this->validasi_by;

		// u_date
		$this->u_date = new DbField('kitab', 'kitab', 'u_date', 'u_date', '`u_date`', CastDateFieldForLike("`u_date`", 0, "DB"), 135, 19, -1, FALSE, '`u_date`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->u_date->Sortable = FALSE; // Allow sort
		$this->u_date->DefaultErrorMessage = str_replace("%s", $GLOBALS["DATE_FORMAT"], $Language->phrase("IncorrectDate"));
		$this->fields['u_date'] = &$this->u_date;

		// i_date
		$this->i_date = new DbField('kitab', 'kitab', 'i_date', 'i_date', '`i_date`', CastDateFieldForLike("`i_date`", 0, "DB"), 135, 19, -1, FALSE, '`i_date`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->i_date->Sortable = FALSE; // Allow sort
		$this->i_date->DefaultErrorMessage = str_replace("%s", $GLOBALS["DATE_FORMAT"], $Language->phrase("IncorrectDate"));
		$this->fields['i_date'] = &$this->i_date;

		// validasi_date
		$this->validasi_date = new DbField('kitab', 'kitab', 'validasi_date', 'validasi_date', '`validasi_date`', CastDateFieldForLike("`validasi_date`", 0, "DB"), 135, 19, -1, FALSE, '`validasi_date`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'TEXT');
		$this->validasi_date->Sortable = FALSE; // Allow sort
		$this->validasi_date->DefaultErrorMessage = str_replace("%s", $GLOBALS["DATE_FORMAT"], $Language->phrase("IncorrectDate"));
		$this->fields['validasi_date'] = &$this->validasi_date;

		// aktif
		$this->aktif = new DbField('kitab', 'kitab', 'aktif', 'aktif', '`aktif`', '`aktif`', 200, 255, -1, FALSE, '`aktif`', FALSE, FALSE, FALSE, 'FORMATTED TEXT', 'RADIO');
		$this->aktif->Sortable = FALSE; // Allow sort
		$this->aktif->Lookup = new Lookup('aktif', 'kitab', FALSE, '', ["","","",""], [], [], [], [], [], [], '', '');
		$this->aktif->OptionCount = 2;
		$this->fields['aktif'] = &$this->aktif;
	}

	// Field Visibility
	public function getFieldVisibility($fldParm)
	{
		global $Security;
		return $this->$fldParm->Visible; // Returns original value
	}

	// Set left column class (must be predefined col-*-* classes of Bootstrap grid system)
	function setLeftColumnClass($class)
	{
		if (preg_match('/^col\-(\w+)\-(\d+)$/', $class, $match)) {
			$this->LeftColumnClass = $class . " col-form-label ew-label";
			$this->RightColumnClass = "col-" . $match[1] . "-" . strval(12 - (int)$match[2]);
			$this->OffsetColumnClass = $this->RightColumnClass . " " . str_replace("col-", "offset-", $class);
			$this->TableLeftColumnClass = preg_replace('/^col-\w+-(\d+)$/', "w-col-$1", $class); // Change to w-col-*
		}
	}

	// Current detail table name
	public function getCurrentDetailTable()
	{
		return @$_SESSION[PROJECT_NAME . "_" . $this->TableVar . "_" . Config("TABLE_DETAIL_TABLE")];
	}
	public function setCurrentDetailTable($v)
	{
		$_SESSION[PROJECT_NAME . "_" . $this->TableVar . "_" . Config("TABLE_DETAIL_TABLE")] = $v;
	}

	// Get detail url
	public function getDetailUrl()
	{

		// Detail url
		$detailUrl = "";
		if ($this->getCurrentDetailTable() == "kitab_detil") {
			$detailUrl = $GLOBALS["kitab_detil"]->getListUrl() . "?" . Config("TABLE_SHOW_MASTER") . "=" . $this->TableVar;
			$detailUrl .= "&fk_id=" . urlencode($this->id->CurrentValue);
		}
		if ($detailUrl == "")
			$detailUrl = "";
		return $detailUrl;
	}

	// Table level SQL
	public function getSqlFrom() // From
	{
		return ($this->SqlFrom != "") ? $this->SqlFrom : "`kitab`";
	}
	public function sqlFrom() // For backward compatibility
	{
		return $this->getSqlFrom();
	}
	public function setSqlFrom($v)
	{
		$this->SqlFrom = $v;
	}
	public function getSqlSelect() // Select
	{
		return ($this->SqlSelect != "") ? $this->SqlSelect : "SELECT * FROM " . $this->getSqlFrom();
	}
	public function sqlSelect() // For backward compatibility
	{
		return $this->getSqlSelect();
	}
	public function setSqlSelect($v)
	{
		$this->SqlSelect = $v;
	}
	public function getSqlWhere() // Where
	{
		$where = ($this->SqlWhere != "") ? $this->SqlWhere : "";
		$this->TableFilter = "";
		AddFilter($where, $this->TableFilter);
		return $where;
	}
	public function sqlWhere() // For backward compatibility
	{
		return $this->getSqlWhere();
	}
	public function setSqlWhere($v)
	{
		$this->SqlWhere = $v;
	}
	public function getSqlGroupBy() // Group By
	{
		return ($this->SqlGroupBy != "") ? $this->SqlGroupBy : "";
	}
	public function sqlGroupBy() // For backward compatibility
	{
		return $this->getSqlGroupBy();
	}
	public function setSqlGroupBy($v)
	{
		$this->SqlGroupBy = $v;
	}
	public function getSqlHaving() // Having
	{
		return ($this->SqlHaving != "") ? $this->SqlHaving : "";
	}
	public function sqlHaving() // For backward compatibility
	{
		return $this->getSqlHaving();
	}
	public function setSqlHaving($v)
	{
		$this->SqlHaving = $v;
	}
	public function getSqlOrderBy() // Order By
	{
		return ($this->SqlOrderBy != "") ? $this->SqlOrderBy : "";
	}
	public function sqlOrderBy() // For backward compatibility
	{
		return $this->getSqlOrderBy();
	}
	public function setSqlOrderBy($v)
	{
		$this->SqlOrderBy = $v;
	}

	// Apply User ID filters
	public function applyUserIDFilters($filter, $id = "")
	{
		return $filter;
	}

	// Check if User ID security allows view all
	public function userIDAllow($id = "")
	{
		$allow = $this->UserIDAllowSecurity;
		switch ($id) {
			case "add":
			case "copy":
			case "gridadd":
			case "register":
			case "addopt":
				return (($allow & 1) == 1);
			case "edit":
			case "gridedit":
			case "update":
			case "changepwd":
			case "forgotpwd":
				return (($allow & 4) == 4);
			case "delete":
				return (($allow & 2) == 2);
			case "view":
				return (($allow & 32) == 32);
			case "search":
				return (($allow & 64) == 64);
			case "lookup":
				return (($allow & 256) == 256);
			default:
				return (($allow & 8) == 8);
		}
	}

	// Get recordset
	public function getRecordset($sql, $rowcnt = -1, $offset = -1)
	{
		$conn = $this->getConnection();
		$conn->raiseErrorFn = Config("ERROR_FUNC");
		$rs = $conn->selectLimit($sql, $rowcnt, $offset);
		$conn->raiseErrorFn = "";
		return $rs;
	}

	// Get record count
	public function getRecordCount($sql, $c = NULL)
	{
		$cnt = -1;
		$rs = NULL;
		$sql = preg_replace('/\/\*BeginOrderBy\*\/[\s\S]+\/\*EndOrderBy\*\//', "", $sql); // Remove ORDER BY clause (MSSQL)
		$pattern = '/^SELECT\s([\s\S]+)\sFROM\s/i';

		// Skip Custom View / SubQuery / SELECT DISTINCT / ORDER BY
		if (($this->TableType == 'TABLE' || $this->TableType == 'VIEW' || $this->TableType == 'LINKTABLE') &&
			preg_match($pattern, $sql) && !preg_match('/\(\s*(SELECT[^)]+)\)/i', $sql) &&
			!preg_match('/^\s*select\s+distinct\s+/i', $sql) && !preg_match('/\s+order\s+by\s+/i', $sql)) {
			$sqlwrk = "SELECT COUNT(*) FROM " . preg_replace($pattern, "", $sql);
		} else {
			$sqlwrk = "SELECT COUNT(*) FROM (" . $sql . ") COUNT_TABLE";
		}
		$conn = $c ?: $this->getConnection();
		if ($rs = $conn->execute($sqlwrk)) {
			if (!$rs->EOF && $rs->FieldCount() > 0) {
				$cnt = $rs->fields[0];
				$rs->close();
			}
			return (int)$cnt;
		}

		// Unable to get count, get record count directly
		if ($rs = $conn->execute($sql)) {
			$cnt = $rs->RecordCount();
			$rs->close();
			return (int)$cnt;
		}
		return $cnt;
	}

	// Get SQL
	public function getSql($where, $orderBy = "")
	{
		return BuildSelectSql($this->getSqlSelect(), $this->getSqlWhere(),
			$this->getSqlGroupBy(), $this->getSqlHaving(), $this->getSqlOrderBy(),
			$where, $orderBy);
	}

	// Table SQL
	public function getCurrentSql()
	{
		$filter = $this->CurrentFilter;
		$filter = $this->applyUserIDFilters($filter);
		$sort = $this->getSessionOrderBy();
		return $this->getSql($filter, $sort);
	}

	// Table SQL with List page filter
	public function getListSql()
	{
		$filter = $this->UseSessionForListSql ? $this->getSessionWhere() : "";
		AddFilter($filter, $this->CurrentFilter);
		$filter = $this->applyUserIDFilters($filter);
		$select = $this->getSqlSelect();
		$sort = $this->UseSessionForListSql ? $this->getSessionOrderBy() : "";
		return BuildSelectSql($select, $this->getSqlWhere(), $this->getSqlGroupBy(),
			$this->getSqlHaving(), $this->getSqlOrderBy(), $filter, $sort);
	}

	// Get ORDER BY clause
	public function getOrderBy()
	{
		$sort = $this->getSessionOrderBy();
		return BuildSelectSql("", "", "", "", $this->getSqlOrderBy(), "", $sort);
	}

	// Get record count based on filter (for detail record count in master table pages)
	public function loadRecordCount($filter)
	{
		$origFilter = $this->CurrentFilter;
		$this->CurrentFilter = $filter;
		$select = $this->TableType == 'CUSTOMVIEW' ? $this->getSqlSelect() : "SELECT * FROM " . $this->getSqlFrom();
		$groupBy = $this->TableType == 'CUSTOMVIEW' ? $this->getSqlGroupBy() : "";
		$having = $this->TableType == 'CUSTOMVIEW' ? $this->getSqlHaving() : "";
		$sql = BuildSelectSql($select, $this->getSqlWhere(), $groupBy, $having, "", $this->CurrentFilter, "");
		$cnt = $this->getRecordCount($sql);
		$this->CurrentFilter = $origFilter;
		return $cnt;
	}

	// Get record count (for current List page)
	public function listRecordCount()
	{
		$filter = $this->getSessionWhere();
		AddFilter($filter, $this->CurrentFilter);
		$filter = $this->applyUserIDFilters($filter);
		$select = $this->TableType == 'CUSTOMVIEW' ? $this->getSqlSelect() : "SELECT * FROM " . $this->getSqlFrom();
		$groupBy = $this->TableType == 'CUSTOMVIEW' ? $this->getSqlGroupBy() : "";
		$having = $this->TableType == 'CUSTOMVIEW' ? $this->getSqlHaving() : "";
		$sql = BuildSelectSql($select, $this->getSqlWhere(), $groupBy, $having, "", $filter, "");
		$cnt = $this->getRecordCount($sql);
		return $cnt;
	}

	// INSERT statement
	protected function insertSql(&$rs)
	{
		$names = "";
		$values = "";
		foreach ($rs as $name => $value) {
			if (!isset($this->fields[$name]) || $this->fields[$name]->IsCustom)
				continue;
			$names .= $this->fields[$name]->Expression . ",";
			$values .= QuotedValue($value, $this->fields[$name]->DataType, $this->Dbid) . ",";
		}
		$names = preg_replace('/,+$/', "", $names);
		$values = preg_replace('/,+$/', "", $values);
		return "INSERT INTO " . $this->UpdateTable . " (" . $names . ") VALUES (" . $values . ")";
	}

	// Insert
	public function insert(&$rs)
	{
		$conn = $this->getConnection();
		$success = $conn->execute($this->insertSql($rs));
		if ($success) {

			// Get insert id if necessary
			$this->id->setDbValue($conn->insert_ID());
			$rs['id'] = $this->id->DbValue;
		}
		return $success;
	}

	// UPDATE statement
	protected function updateSql(&$rs, $where = "", $curfilter = TRUE)
	{
		$sql = "UPDATE " . $this->UpdateTable . " SET ";
		foreach ($rs as $name => $value) {
			if (!isset($this->fields[$name]) || $this->fields[$name]->IsCustom || $this->fields[$name]->IsAutoIncrement)
				continue;
			$sql .= $this->fields[$name]->Expression . "=";
			$sql .= QuotedValue($value, $this->fields[$name]->DataType, $this->Dbid) . ",";
		}
		$sql = preg_replace('/,+$/', "", $sql);
		$filter = ($curfilter) ? $this->CurrentFilter : "";
		if (is_array($where))
			$where = $this->arrayToFilter($where);
		AddFilter($filter, $where);
		if ($filter != "")
			$sql .= " WHERE " . $filter;
		return $sql;
	}

	// Update
	public function update(&$rs, $where = "", $rsold = NULL, $curfilter = TRUE)
	{
		$conn = $this->getConnection();
		$success = $conn->execute($this->updateSql($rs, $where, $curfilter));
		return $success;
	}

	// DELETE statement
	protected function deleteSql(&$rs, $where = "", $curfilter = TRUE)
	{
		$sql = "DELETE FROM " . $this->UpdateTable . " WHERE ";
		if (is_array($where))
			$where = $this->arrayToFilter($where);
		if ($rs) {
			if (array_key_exists('id', $rs))
				AddFilter($where, QuotedName('id', $this->Dbid) . '=' . QuotedValue($rs['id'], $this->id->DataType, $this->Dbid));
		}
		$filter = ($curfilter) ? $this->CurrentFilter : "";
		AddFilter($filter, $where);
		if ($filter != "")
			$sql .= $filter;
		else
			$sql .= "0=1"; // Avoid delete
		return $sql;
	}

	// Delete
	public function delete(&$rs, $where = "", $curfilter = FALSE)
	{
		$success = TRUE;
		$conn = $this->getConnection();
		if ($success)
			$success = $conn->execute($this->deleteSql($rs, $where, $curfilter));
		return $success;
	}

	// Load DbValue from recordset or array
	protected function loadDbValues(&$rs)
	{
		if (!$rs || !is_array($rs) && $rs->EOF)
			return;
		$row = is_array($rs) ? $rs : $rs->fields;
		$this->id->DbValue = $row['id'];
		$this->judul->DbValue = $row['judul'];
		$this->pengarang->DbValue = $row['pengarang'];
		$this->keterangan->DbValue = $row['keterangan'];
		$this->sampul->Upload->DbValue = $row['sampul'];
		$this->thn_terbit->DbValue = $row['thn_terbit'];
		$this->tag->DbValue = $row['tag'];
		$this->u_by->DbValue = $row['u_by'];
		$this->i_by->DbValue = $row['i_by'];
		$this->validasi_by->DbValue = $row['validasi_by'];
		$this->u_date->DbValue = $row['u_date'];
		$this->i_date->DbValue = $row['i_date'];
		$this->validasi_date->DbValue = $row['validasi_date'];
		$this->aktif->DbValue = $row['aktif'];
	}

	// Delete uploaded files
	public function deleteUploadedFiles($row)
	{
		$this->loadDbValues($row);
		$oldFiles = EmptyValue($row['sampul']) ? [] : [$row['sampul']];
		foreach ($oldFiles as $oldFile) {
			if (file_exists($this->sampul->oldPhysicalUploadPath() . $oldFile))
				@unlink($this->sampul->oldPhysicalUploadPath() . $oldFile);
		}
	}

	// Record filter WHERE clause
	protected function sqlKeyFilter()
	{
		return "`id` = @id@";
	}

	// Get record filter
	public function getRecordFilter($row = NULL)
	{
		$keyFilter = $this->sqlKeyFilter();
		if (is_array($row))
			$val = array_key_exists('id', $row) ? $row['id'] : NULL;
		else
			$val = $this->id->OldValue !== NULL ? $this->id->OldValue : $this->id->CurrentValue;
		if (!is_numeric($val))
			return "0=1"; // Invalid key
		if ($val == NULL)
			return "0=1"; // Invalid key
		else
			$keyFilter = str_replace("@id@", AdjustSql($val, $this->Dbid), $keyFilter); // Replace key value
		return $keyFilter;
	}

	// Return page URL
	public function getReturnUrl()
	{
		$name = PROJECT_NAME . "_" . $this->TableVar . "_" . Config("TABLE_RETURN_URL");

		// Get referer URL automatically
		if (ServerVar("HTTP_REFERER") != "" && ReferPageName() != CurrentPageName() && ReferPageName() != "") // Referer not same page or login page
			$_SESSION[$name] = ServerVar("HTTP_REFERER"); // Save to Session
		if (@$_SESSION[$name] != "") {
			return $_SESSION[$name];
		} else {
			return "";
		}
	}
	public function setReturnUrl($v)
	{
		$_SESSION[PROJECT_NAME . "_" . $this->TableVar . "_" . Config("TABLE_RETURN_URL")] = $v;
	}

	// Get modal caption
	public function getModalCaption($pageName)
	{
		global $Language;
		if ($pageName == "")
			return $Language->phrase("View");
		elseif ($pageName == "")
			return $Language->phrase("Edit");
		elseif ($pageName == "")
			return $Language->phrase("Add");
		else
			return "";
	}

	// List URL
	public function getListUrl()
	{
		return "";
	}

	// View URL
	public function getViewUrl($parm = "")
	{
		if ($parm != "")
			$url = $this->keyUrl("", $this->getUrlParm($parm));
		else
			$url = $this->keyUrl("", $this->getUrlParm(Config("TABLE_SHOW_DETAIL") . "="));
		return $this->addMasterUrl($url);
	}

	// Add URL
	public function getAddUrl($parm = "")
	{
		if ($parm != "")
			$url = "?" . $this->getUrlParm($parm);
		else
			$url = "";
		return $this->addMasterUrl($url);
	}

	// Edit URL
	public function getEditUrl($parm = "")
	{
		if ($parm != "")
			$url = $this->keyUrl("", $this->getUrlParm($parm));
		else
			$url = $this->keyUrl("", $this->getUrlParm(Config("TABLE_SHOW_DETAIL") . "="));
		return $this->addMasterUrl($url);
	}

	// Inline edit URL
	public function getInlineEditUrl()
	{
		$url = $this->keyUrl(CurrentPageName(), $this->getUrlParm("action=edit"));
		return $this->addMasterUrl($url);
	}

	// Copy URL
	public function getCopyUrl($parm = "")
	{
		if ($parm != "")
			$url = $this->keyUrl("", $this->getUrlParm($parm));
		else
			$url = $this->keyUrl("", $this->getUrlParm(Config("TABLE_SHOW_DETAIL") . "="));
		return $this->addMasterUrl($url);
	}

	// Inline copy URL
	public function getInlineCopyUrl()
	{
		$url = $this->keyUrl(CurrentPageName(), $this->getUrlParm("action=copy"));
		return $this->addMasterUrl($url);
	}

	// Delete URL
	public function getDeleteUrl()
	{
		return $this->keyUrl("", $this->getUrlParm());
	}

	// Add master url
	public function addMasterUrl($url)
	{
		return $url;
	}
	public function keyToJson($htmlEncode = FALSE)
	{
		$json = "";
		$json .= "id:" . JsonEncode($this->id->CurrentValue, "number");
		$json = "{" . $json . "}";
		if ($htmlEncode)
			$json = HtmlEncode($json);
		return $json;
	}

	// Add key value to URL
	public function keyUrl($url, $parm = "")
	{
		$url = $url . "?";
		if ($parm != "")
			$url .= $parm . "&";
		if ($this->id->CurrentValue != NULL) {
			$url .= "id=" . urlencode($this->id->CurrentValue);
		} else {
			return "javascript:ew.alert(ew.language.phrase('InvalidRecord'));";
		}
		return $url;
	}

	// Sort URL
	public function sortUrl(&$fld)
	{
		return "";
	}

	// Get record keys from Post/Get/Session
	public function getRecordKeys()
	{
		$arKeys = [];
		$arKey = [];
		if (Param("key_m") !== NULL) {
			$arKeys = Param("key_m");
			$cnt = count($arKeys);
		} else {
			if (Param("id") !== NULL)
				$arKeys[] = Param("id");
			elseif (IsApi() && Key(0) !== NULL)
				$arKeys[] = Key(0);
			elseif (IsApi() && Route(2) !== NULL)
				$arKeys[] = Route(2);
			else
				$arKeys = NULL; // Do not setup

			//return $arKeys; // Do not return yet, so the values will also be checked by the following code
		}

		// Check keys
		$ar = [];
		if (is_array($arKeys)) {
			foreach ($arKeys as $key) {
				if (!is_numeric($key))
					continue;
				$ar[] = $key;
			}
		}
		return $ar;
	}

	// Get filter from record keys
	public function getFilterFromRecordKeys($setCurrent = TRUE)
	{
		$arKeys = $this->getRecordKeys();
		$keyFilter = "";
		foreach ($arKeys as $key) {
			if ($keyFilter != "") $keyFilter .= " OR ";
			if ($setCurrent)
				$this->id->CurrentValue = $key;
			else
				$this->id->OldValue = $key;
			$keyFilter .= "(" . $this->getRecordFilter() . ")";
		}
		return $keyFilter;
	}

	// Load rows based on filter
	public function &loadRs($filter)
	{

		// Set up filter (WHERE Clause)
		$sql = $this->getSql($filter);
		$conn = $this->getConnection();
		$rs = $conn->execute($sql);
		return $rs;
	}

	// Load row values from recordset
	public function loadListRowValues(&$rs)
	{
		$this->id->setDbValue($rs->fields('id'));
		$this->judul->setDbValue($rs->fields('judul'));
		$this->pengarang->setDbValue($rs->fields('pengarang'));
		$this->keterangan->setDbValue($rs->fields('keterangan'));
		$this->sampul->Upload->DbValue = $rs->fields('sampul');
		$this->thn_terbit->setDbValue($rs->fields('thn_terbit'));
		$this->tag->setDbValue($rs->fields('tag'));
		$this->u_by->setDbValue($rs->fields('u_by'));
		$this->i_by->setDbValue($rs->fields('i_by'));
		$this->validasi_by->setDbValue($rs->fields('validasi_by'));
		$this->u_date->setDbValue($rs->fields('u_date'));
		$this->i_date->setDbValue($rs->fields('i_date'));
		$this->validasi_date->setDbValue($rs->fields('validasi_date'));
		$this->aktif->setDbValue($rs->fields('aktif'));
	}

	// Render list row values
	public function renderListRow()
	{
		global $Security, $CurrentLanguage, $Language;

		// Common render codes
		// id

		$this->id->CellCssStyle = "white-space: nowrap;";

		// judul
		$this->judul->CellCssStyle = "white-space: nowrap;";

		// pengarang
		$this->pengarang->CellCssStyle = "white-space: nowrap;";

		// keterangan
		$this->keterangan->CellCssStyle = "white-space: nowrap;";

		// sampul
		$this->sampul->CellCssStyle = "white-space: nowrap;";

		// thn_terbit
		$this->thn_terbit->CellCssStyle = "white-space: nowrap;";

		// tag
		$this->tag->CellCssStyle = "white-space: nowrap;";

		// u_by
		$this->u_by->CellCssStyle = "white-space: nowrap;";

		// i_by
		$this->i_by->CellCssStyle = "white-space: nowrap;";

		// validasi_by
		$this->validasi_by->CellCssStyle = "white-space: nowrap;";

		// u_date
		$this->u_date->CellCssStyle = "white-space: nowrap;";

		// i_date
		$this->i_date->CellCssStyle = "white-space: nowrap;";

		// validasi_date
		$this->validasi_date->CellCssStyle = "white-space: nowrap;";

		// aktif
		$this->aktif->CellCssStyle = "white-space: nowrap;";

		// id
		$this->id->ViewValue = $this->id->CurrentValue;
		$this->id->ViewCustomAttributes = "";

		// judul
		$this->judul->ViewValue = $this->judul->CurrentValue;
		$this->judul->ViewCustomAttributes = "";

		// pengarang
		$this->pengarang->ViewValue = $this->pengarang->CurrentValue;
		$this->pengarang->ViewCustomAttributes = "";

		// keterangan
		$this->keterangan->ViewValue = $this->keterangan->CurrentValue;
		$this->keterangan->ViewCustomAttributes = "";

		// sampul
		if (!EmptyValue($this->sampul->Upload->DbValue)) {
			$this->sampul->ImageAlt = $this->sampul->alt();
			$this->sampul->ViewValue = $this->sampul->Upload->DbValue;
		} else {
			$this->sampul->ViewValue = "";
		}
		$this->sampul->ViewCustomAttributes = "";

		// thn_terbit
		$this->thn_terbit->ViewValue = $this->thn_terbit->CurrentValue;
		$this->thn_terbit->ViewValue = FormatNumber($this->thn_terbit->ViewValue, 0, -2, -2, -2);
		$this->thn_terbit->ViewCustomAttributes = "";

		// tag
		$this->tag->ViewValue = $this->tag->CurrentValue;
		$this->tag->ViewCustomAttributes = "";

		// u_by
		$this->u_by->ViewValue = $this->u_by->CurrentValue;
		$this->u_by->ViewValue = FormatNumber($this->u_by->ViewValue, 0, -2, -2, -2);
		$this->u_by->ViewCustomAttributes = "";

		// i_by
		$this->i_by->ViewValue = $this->i_by->CurrentValue;
		$this->i_by->ViewValue = FormatNumber($this->i_by->ViewValue, 0, -2, -2, -2);
		$this->i_by->ViewCustomAttributes = "";

		// validasi_by
		$this->validasi_by->ViewValue = $this->validasi_by->CurrentValue;
		$this->validasi_by->ViewValue = FormatNumber($this->validasi_by->ViewValue, 0, -2, -2, -2);
		$this->validasi_by->ViewCustomAttributes = "";

		// u_date
		$this->u_date->ViewValue = $this->u_date->CurrentValue;
		$this->u_date->ViewCustomAttributes = "";

		// i_date
		$this->i_date->ViewValue = $this->i_date->CurrentValue;
		$this->i_date->ViewCustomAttributes = "";

		// validasi_date
		$this->validasi_date->ViewValue = $this->validasi_date->CurrentValue;
		$this->validasi_date->ViewCustomAttributes = "";

		// aktif
		if (strval($this->aktif->CurrentValue) != "") {
			$this->aktif->ViewValue = $this->aktif->optionCaption($this->aktif->CurrentValue);
		} else {
			$this->aktif->ViewValue = NULL;
		}
		$this->aktif->ViewCustomAttributes = "";

		// id
		$this->id->LinkCustomAttributes = "";
		$this->id->HrefValue = "";
		$this->id->TooltipValue = "";

		// judul
		$this->judul->LinkCustomAttributes = "";
		$this->judul->HrefValue = "";
		$this->judul->TooltipValue = "";

		// pengarang
		$this->pengarang->LinkCustomAttributes = "";
		$this->pengarang->HrefValue = "";
		$this->pengarang->TooltipValue = "";

		// keterangan
		$this->keterangan->LinkCustomAttributes = "";
		$this->keterangan->HrefValue = "";
		$this->keterangan->TooltipValue = "";

		// sampul
		$this->sampul->LinkCustomAttributes = "";
		$this->sampul->HrefValue = "";
		$this->sampul->ExportHrefValue = $this->sampul->UploadPath . $this->sampul->Upload->DbValue;
		$this->sampul->TooltipValue = "";
		if ($this->sampul->UseColorbox) {
			if (EmptyValue($this->sampul->TooltipValue))
				$this->sampul->LinkAttrs["title"] = $Language->phrase("ViewImageGallery");
			$this->sampul->LinkAttrs["data-rel"] = "kitab_sampul";
			$this->sampul->LinkAttrs->appendClass("ew-lightbox");
		}

		// thn_terbit
		$this->thn_terbit->LinkCustomAttributes = "";
		$this->thn_terbit->HrefValue = "";
		$this->thn_terbit->TooltipValue = "";

		// tag
		$this->tag->LinkCustomAttributes = "";
		$this->tag->HrefValue = "";
		$this->tag->TooltipValue = "";

		// u_by
		$this->u_by->LinkCustomAttributes = "";
		$this->u_by->HrefValue = "";
		$this->u_by->TooltipValue = "";

		// i_by
		$this->i_by->LinkCustomAttributes = "";
		$this->i_by->HrefValue = "";
		$this->i_by->TooltipValue = "";

		// validasi_by
		$this->validasi_by->LinkCustomAttributes = "";
		$this->validasi_by->HrefValue = "";
		$this->validasi_by->TooltipValue = "";

		// u_date
		$this->u_date->LinkCustomAttributes = "";
		$this->u_date->HrefValue = "";
		$this->u_date->TooltipValue = "";

		// i_date
		$this->i_date->LinkCustomAttributes = "";
		$this->i_date->HrefValue = "";
		$this->i_date->TooltipValue = "";

		// validasi_date
		$this->validasi_date->LinkCustomAttributes = "";
		$this->validasi_date->HrefValue = "";
		$this->validasi_date->TooltipValue = "";

		// aktif
		$this->aktif->LinkCustomAttributes = "";
		$this->aktif->HrefValue = "";
		$this->aktif->TooltipValue = "";

		// Save data for Custom Template
		$this->Rows[] = $this->customTemplateFieldValues();
	}

	// Render edit row values
	public function renderEditRow()
	{
		global $Security, $CurrentLanguage, $Language;

		// id
		$this->id->EditAttrs["class"] = "form-control";
		$this->id->EditCustomAttributes = "";
		$this->id->EditValue = $this->id->CurrentValue;
		$this->id->ViewCustomAttributes = "";

		// judul
		$this->judul->EditAttrs["class"] = "form-control";
		$this->judul->EditCustomAttributes = "";
		if (!$this->judul->Raw)
			$this->judul->CurrentValue = HtmlDecode($this->judul->CurrentValue);
		$this->judul->EditValue = $this->judul->CurrentValue;
		$this->judul->PlaceHolder = RemoveHtml($this->judul->caption());

		// pengarang
		$this->pengarang->EditAttrs["class"] = "form-control";
		$this->pengarang->EditCustomAttributes = "";
		if (!$this->pengarang->Raw)
			$this->pengarang->CurrentValue = HtmlDecode($this->pengarang->CurrentValue);
		$this->pengarang->EditValue = $this->pengarang->CurrentValue;
		$this->pengarang->PlaceHolder = RemoveHtml($this->pengarang->caption());

		// keterangan
		$this->keterangan->EditAttrs["class"] = "form-control";
		$this->keterangan->EditCustomAttributes = "";
		if (!$this->keterangan->Raw)
			$this->keterangan->CurrentValue = HtmlDecode($this->keterangan->CurrentValue);
		$this->keterangan->EditValue = $this->keterangan->CurrentValue;
		$this->keterangan->PlaceHolder = RemoveHtml($this->keterangan->caption());

		// sampul
		$this->sampul->EditAttrs["class"] = "form-control";
		$this->sampul->EditCustomAttributes = "";
		if (!EmptyValue($this->sampul->Upload->DbValue)) {
			$this->sampul->ImageAlt = $this->sampul->alt();
			$this->sampul->EditValue = $this->sampul->Upload->DbValue;
		} else {
			$this->sampul->EditValue = "";
		}

		// thn_terbit
		$this->thn_terbit->EditAttrs["class"] = "form-control";
		$this->thn_terbit->EditCustomAttributes = "";
		$this->thn_terbit->EditValue = $this->thn_terbit->CurrentValue;
		$this->thn_terbit->PlaceHolder = RemoveHtml($this->thn_terbit->caption());

		// tag
		$this->tag->EditAttrs["class"] = "form-control";
		$this->tag->EditCustomAttributes = "";
		if (!$this->tag->Raw)
			$this->tag->CurrentValue = HtmlDecode($this->tag->CurrentValue);
		$this->tag->EditValue = $this->tag->CurrentValue;
		$this->tag->PlaceHolder = RemoveHtml($this->tag->caption());

		// u_by
		$this->u_by->EditAttrs["class"] = "form-control";
		$this->u_by->EditCustomAttributes = "";
		$this->u_by->EditValue = $this->u_by->CurrentValue;
		$this->u_by->PlaceHolder = RemoveHtml($this->u_by->caption());

		// i_by
		$this->i_by->EditAttrs["class"] = "form-control";
		$this->i_by->EditCustomAttributes = "";
		$this->i_by->EditValue = $this->i_by->CurrentValue;
		$this->i_by->PlaceHolder = RemoveHtml($this->i_by->caption());

		// validasi_by
		$this->validasi_by->EditAttrs["class"] = "form-control";
		$this->validasi_by->EditCustomAttributes = "";
		$this->validasi_by->EditValue = $this->validasi_by->CurrentValue;
		$this->validasi_by->PlaceHolder = RemoveHtml($this->validasi_by->caption());

		// u_date
		$this->u_date->EditAttrs["class"] = "form-control";
		$this->u_date->EditCustomAttributes = "";
		$this->u_date->EditValue = $this->u_date->CurrentValue;
		$this->u_date->PlaceHolder = RemoveHtml($this->u_date->caption());

		// i_date
		$this->i_date->EditAttrs["class"] = "form-control";
		$this->i_date->EditCustomAttributes = "";
		$this->i_date->EditValue = $this->i_date->CurrentValue;
		$this->i_date->PlaceHolder = RemoveHtml($this->i_date->caption());

		// validasi_date
		$this->validasi_date->EditAttrs["class"] = "form-control";
		$this->validasi_date->EditCustomAttributes = "";
		$this->validasi_date->EditValue = $this->validasi_date->CurrentValue;
		$this->validasi_date->PlaceHolder = RemoveHtml($this->validasi_date->caption());

		// aktif
		$this->aktif->EditCustomAttributes = "";
		$this->aktif->EditValue = $this->aktif->options(FALSE);
	}

	// Aggregate list row values
	public function aggregateListRowValues()
	{
	}

	// Aggregate list row (for rendering)
	public function aggregateListRow()
	{
	}

	// Export data in HTML/CSV/Word/Excel/Email/PDF format
	public function exportDocument($doc, $recordset, $startRec = 1, $stopRec = 1, $exportPageType = "")
	{
		if (!$recordset || !$doc)
			return;
		if (!$doc->ExportCustom) {

			// Write header
			$doc->exportTableHeader();
			if ($doc->Horizontal) { // Horizontal format, write header
				$doc->beginExportRow();
				if ($exportPageType == "view") {
					$doc->exportCaption($this->id);
					$doc->exportCaption($this->judul);
					$doc->exportCaption($this->pengarang);
					$doc->exportCaption($this->keterangan);
					$doc->exportCaption($this->sampul);
					$doc->exportCaption($this->thn_terbit);
					$doc->exportCaption($this->tag);
					$doc->exportCaption($this->aktif);
				} else {
				}
				$doc->endExportRow();
			}
		}

		// Move to first record
		$recCnt = $startRec - 1;
		if (!$recordset->EOF) {
			$recordset->moveFirst();
			if ($startRec > 1)
				$recordset->move($startRec - 1);
		}
		while (!$recordset->EOF && $recCnt < $stopRec) {
			$recCnt++;
			if ($recCnt >= $startRec) {
				$rowCnt = $recCnt - $startRec + 1;

				// Page break
				if ($this->ExportPageBreakCount > 0) {
					if ($rowCnt > 1 && ($rowCnt - 1) % $this->ExportPageBreakCount == 0)
						$doc->exportPageBreak();
				}
				$this->loadListRowValues($recordset);

				// Render row
				$this->RowType = ROWTYPE_VIEW; // Render view
				$this->resetAttributes();
				$this->renderListRow();
				if (!$doc->ExportCustom) {
					$doc->beginExportRow($rowCnt); // Allow CSS styles if enabled
					if ($exportPageType == "view") {
						$doc->exportField($this->id);
						$doc->exportField($this->judul);
						$doc->exportField($this->pengarang);
						$doc->exportField($this->keterangan);
						$doc->exportField($this->sampul);
						$doc->exportField($this->thn_terbit);
						$doc->exportField($this->tag);
						$doc->exportField($this->aktif);
					} else {
					}
					$doc->endExportRow($rowCnt);
				}
			}
			$recordset->moveNext();
		}
		if (!$doc->ExportCustom) {
			$doc->exportTableFooter();
		}
	}

	// Get file data
	public function getFileData($fldparm, $key, $resize, $width = 0, $height = 0)
	{
		$width = ($width > 0) ? $width : Config("THUMBNAIL_DEFAULT_WIDTH");
		$height = ($height > 0) ? $height : Config("THUMBNAIL_DEFAULT_HEIGHT");

		// Set up field name / file name field / file type field
		$fldName = "";
		$fileNameFld = "";
		$fileTypeFld = "";
		if ($fldparm == 'sampul') {
			$fldName = "sampul";
		} else {
			return FALSE; // Incorrect field
		}

		// Set up key values
		$ar = explode(Config("COMPOSITE_KEY_SEPARATOR"), $key);
		if (count($ar) == 1) {
			$this->id->CurrentValue = $ar[0];
		} else {
			return FALSE; // Incorrect key
		}

		// Set up filter (WHERE Clause)
		$filter = $this->getRecordFilter();
		$this->CurrentFilter = $filter;
		$sql = $this->getCurrentSql();
		$conn = $this->getConnection();
		$dbtype = GetConnectionType($this->Dbid);
		if (($rs = $conn->execute($sql)) && !$rs->EOF) {
			$val = $rs->fields($fldName);
			if (!EmptyValue($val)) {
				$fld = $this->fields[$fldName];

				// Binary data
				if ($fld->DataType == DATATYPE_BLOB) {
					if ($dbtype != "MYSQL") {
						if (is_array($val) || is_object($val)) // Byte array
							$val = BytesToString($val);
					}
					if ($resize)
						ResizeBinary($val, $width, $height);

					// Write file type
					if ($fileTypeFld != "" && !EmptyValue($rs->fields($fileTypeFld))) {
						AddHeader("Content-type", $rs->fields($fileTypeFld));
					} else {
						AddHeader("Content-type", ContentType($val));
					}

					// Write file name
					$downloadPdf = !Config("EMBED_PDF") && Config("DOWNLOAD_PDF_FILE");
					if ($fileNameFld != "" && !EmptyValue($rs->fields($fileNameFld))) {
						$fileName = $rs->fields($fileNameFld);
						$pathinfo = pathinfo($fileName);
						$ext = strtolower(@$pathinfo["extension"]);
						$isPdf = SameText($ext, "pdf");
						if ($downloadPdf || !$isPdf) // Skip header if not download PDF
							AddHeader("Content-Disposition", "attachment; filename=\"" . $fileName . "\"");
					} else {
						$ext = ContentExtension($val);
						$isPdf = SameText($ext, ".pdf");
						if ($isPdf && $downloadPdf) // Add header if download PDF
							AddHeader("Content-Disposition", "attachment; filename=\"" . $fileName . "\"");
					}

					// Write file data
					if (StartsString("PK", $val) && ContainsString($val, "[Content_Types].xml") &&
						ContainsString($val, "_rels") && ContainsString($val, "docProps")) { // Fix Office 2007 documents
						if (!EndsString("\0\0\0", $val)) // Not ends with 3 or 4 \0
							$val .= "\0\0\0\0";
					}

					// Clear any debug message
					if (ob_get_length())
						ob_end_clean();

					// Write binary data
					Write($val);

				// Upload to folder
				} else {
					if ($fld->UploadMultiple)
						$files = explode(Config("MULTIPLE_UPLOAD_SEPARATOR"), $val);
					else
						$files = [$val];
					$data = [];
					$ar = [];
					foreach ($files as $file) {
						if (!EmptyValue($file))
							$ar[$file] = FullUrl($fld->hrefPath() . $file);
					}
					$data[$fld->Param] = $ar;
					WriteJson($data);
				}
			}
			$rs->close();
			return TRUE;
		}
		return FALSE;
	}

	// Table level events
}
?>