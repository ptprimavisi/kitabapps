<?php
namespace PHPMaker2020\kitab;

/**
 * Page class
 */
class kitab_add extends kitab
{

	// Page ID
	public $PageID = "add";

	// Project ID
	public $ProjectID = "{92280ED0-5B8E-4CEA-8722-C3BA4553E7D5}";

	// Table name
	public $TableName = 'kitab';

	// Page object name
	public $PageObjName = "kitab_add";

	// Page headings
	public $Heading = "";
	public $Subheading = "";
	public $PageHeader;
	public $PageFooter;

	// Token
	public $Token = "";
	public $TokenTimeout = 0;
	public $CheckToken;

	// Page heading
	public function pageHeading()
	{
		global $Language;
		if ($this->Heading != "")
			return $this->Heading;
		if (method_exists($this, "tableCaption"))
			return $this->tableCaption();
		return "";
	}

	// Page subheading
	public function pageSubheading()
	{
		global $Language;
		if ($this->Subheading != "")
			return $this->Subheading;
		if ($this->TableName)
			return $Language->phrase($this->PageID);
		return "";
	}

	// Page name
	public function pageName()
	{
		return CurrentPageName();
	}

	// Page URL
	public function pageUrl()
	{
		$url = CurrentPageName() . "?";
		if ($this->UseTokenInUrl)
			$url .= "t=" . $this->TableVar . "&"; // Add page token
		return $url;
	}

	// Messages
	private $_message = "";
	private $_failureMessage = "";
	private $_successMessage = "";
	private $_warningMessage = "";

	// Get message
	public function getMessage()
	{
		return isset($_SESSION[SESSION_MESSAGE]) ? $_SESSION[SESSION_MESSAGE] : $this->_message;
	}

	// Set message
	public function setMessage($v)
	{
		AddMessage($this->_message, $v);
		$_SESSION[SESSION_MESSAGE] = $this->_message;
	}

	// Get failure message
	public function getFailureMessage()
	{
		return isset($_SESSION[SESSION_FAILURE_MESSAGE]) ? $_SESSION[SESSION_FAILURE_MESSAGE] : $this->_failureMessage;
	}

	// Set failure message
	public function setFailureMessage($v)
	{
		AddMessage($this->_failureMessage, $v);
		$_SESSION[SESSION_FAILURE_MESSAGE] = $this->_failureMessage;
	}

	// Get success message
	public function getSuccessMessage()
	{
		return isset($_SESSION[SESSION_SUCCESS_MESSAGE]) ? $_SESSION[SESSION_SUCCESS_MESSAGE] : $this->_successMessage;
	}

	// Set success message
	public function setSuccessMessage($v)
	{
		AddMessage($this->_successMessage, $v);
		$_SESSION[SESSION_SUCCESS_MESSAGE] = $this->_successMessage;
	}

	// Get warning message
	public function getWarningMessage()
	{
		return isset($_SESSION[SESSION_WARNING_MESSAGE]) ? $_SESSION[SESSION_WARNING_MESSAGE] : $this->_warningMessage;
	}

	// Set warning message
	public function setWarningMessage($v)
	{
		AddMessage($this->_warningMessage, $v);
		$_SESSION[SESSION_WARNING_MESSAGE] = $this->_warningMessage;
	}

	// Clear message
	public function clearMessage()
	{
		$this->_message = "";
		$_SESSION[SESSION_MESSAGE] = "";
	}

	// Clear failure message
	public function clearFailureMessage()
	{
		$this->_failureMessage = "";
		$_SESSION[SESSION_FAILURE_MESSAGE] = "";
	}

	// Clear success message
	public function clearSuccessMessage()
	{
		$this->_successMessage = "";
		$_SESSION[SESSION_SUCCESS_MESSAGE] = "";
	}

	// Clear warning message
	public function clearWarningMessage()
	{
		$this->_warningMessage = "";
		$_SESSION[SESSION_WARNING_MESSAGE] = "";
	}

	// Clear messages
	public function clearMessages()
	{
		$this->clearMessage();
		$this->clearFailureMessage();
		$this->clearSuccessMessage();
		$this->clearWarningMessage();
	}

	// Show message
	public function showMessage()
	{
		$hidden = FALSE;
		$html = "";

		// Message
		$message = $this->getMessage();
		if (method_exists($this, "Message_Showing"))
			$this->Message_Showing($message, "");
		if ($message != "") { // Message in Session, display
			if (!$hidden)
				$message = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' . $message;
			$html .= '<div class="alert alert-info alert-dismissible ew-info"><i class="icon fas fa-info"></i>' . $message . '</div>';
			$_SESSION[SESSION_MESSAGE] = ""; // Clear message in Session
		}

		// Warning message
		$warningMessage = $this->getWarningMessage();
		if (method_exists($this, "Message_Showing"))
			$this->Message_Showing($warningMessage, "warning");
		if ($warningMessage != "") { // Message in Session, display
			if (!$hidden)
				$warningMessage = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' . $warningMessage;
			$html .= '<div class="alert alert-warning alert-dismissible ew-warning"><i class="icon fas fa-exclamation"></i>' . $warningMessage . '</div>';
			$_SESSION[SESSION_WARNING_MESSAGE] = ""; // Clear message in Session
		}

		// Success message
		$successMessage = $this->getSuccessMessage();
		if (method_exists($this, "Message_Showing"))
			$this->Message_Showing($successMessage, "success");
		if ($successMessage != "") { // Message in Session, display
			if (!$hidden)
				$successMessage = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' . $successMessage;
			$html .= '<div class="alert alert-success alert-dismissible ew-success"><i class="icon fas fa-check"></i>' . $successMessage . '</div>';
			$_SESSION[SESSION_SUCCESS_MESSAGE] = ""; // Clear message in Session
		}

		// Failure message
		$errorMessage = $this->getFailureMessage();
		if (method_exists($this, "Message_Showing"))
			$this->Message_Showing($errorMessage, "failure");
		if ($errorMessage != "") { // Message in Session, display
			if (!$hidden)
				$errorMessage = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' . $errorMessage;
			$html .= '<div class="alert alert-danger alert-dismissible ew-error"><i class="icon fas fa-ban"></i>' . $errorMessage . '</div>';
			$_SESSION[SESSION_FAILURE_MESSAGE] = ""; // Clear message in Session
		}
		echo '<div class="ew-message-dialog' . (($hidden) ? ' d-none' : "") . '">' . $html . '</div>';
	}

	// Get message as array
	public function getMessages()
	{
		$ar = [];

		// Message
		$message = $this->getMessage();

		//if (method_exists($this, "Message_Showing"))
		//	$this->Message_Showing($message, "");

		if ($message != "") { // Message in Session, display
			$ar["message"] = $message;
			$_SESSION[SESSION_MESSAGE] = ""; // Clear message in Session
		}

		// Warning message
		$warningMessage = $this->getWarningMessage();

		//if (method_exists($this, "Message_Showing"))
		//	$this->Message_Showing($warningMessage, "warning");

		if ($warningMessage != "") { // Message in Session, display
			$ar["warningMessage"] = $warningMessage;
			$_SESSION[SESSION_WARNING_MESSAGE] = ""; // Clear message in Session
		}

		// Success message
		$successMessage = $this->getSuccessMessage();

		//if (method_exists($this, "Message_Showing"))
		//	$this->Message_Showing($successMessage, "success");

		if ($successMessage != "") { // Message in Session, display
			$ar["successMessage"] = $successMessage;
			$_SESSION[SESSION_SUCCESS_MESSAGE] = ""; // Clear message in Session
		}

		// Failure message
		$failureMessage = $this->getFailureMessage();

		//if (method_exists($this, "Message_Showing"))
		//	$this->Message_Showing($failureMessage, "failure");

		if ($failureMessage != "") { // Message in Session, display
			$ar["failureMessage"] = $failureMessage;
			$_SESSION[SESSION_FAILURE_MESSAGE] = ""; // Clear message in Session
		}
		return $ar;
	}

	// Show Page Header
	public function showPageHeader()
	{
		$header = $this->PageHeader;
		if ($header != "") { // Header exists, display
			echo '<p id="ew-page-header">' . $header . '</p>';
		}
	}

	// Show Page Footer
	public function showPageFooter()
	{
		$footer = $this->PageFooter;
		if ($footer != "") { // Footer exists, display
			echo '<p id="ew-page-footer">' . $footer . '</p>';
		}
	}

	// Validate page request
	protected function isPageRequest()
	{
		global $CurrentForm;
		if ($this->UseTokenInUrl) {
			if ($CurrentForm)
				return ($this->TableVar == $CurrentForm->getValue("t"));
			if (Get("t") !== NULL)
				return ($this->TableVar == Get("t"));
		}
		return TRUE;
	}

	// Valid Post
	protected function validPost()
	{
		if (!$this->CheckToken || !IsPost() || IsApi())
			return TRUE;
		if (Post(Config("TOKEN_NAME")) === NULL)
			return FALSE;
		$fn = Config("CHECK_TOKEN_FUNC");
		if (is_callable($fn))
			return $fn(Post(Config("TOKEN_NAME")), $this->TokenTimeout);
		return FALSE;
	}

	// Create Token
	public function createToken()
	{
		global $CurrentToken;
		$fn = Config("CREATE_TOKEN_FUNC"); // Always create token, required by API file/lookup request
		if ($this->Token == "" && is_callable($fn)) // Create token
			$this->Token = $fn();
		$CurrentToken = $this->Token; // Save to global variable
	}

	// Constructor
	public function __construct()
	{
		global $Language, $DashboardReport;

		// Check token
		$this->CheckToken = Config("CHECK_TOKEN");

		// Initialize
		$GLOBALS["Page"] = &$this;
		$this->TokenTimeout = SessionTimeoutTime();

		// Language object
		if (!isset($Language))
			$Language = new Language();

		// Parent constuctor
		parent::__construct();

		// Table object (kitab)
		if (!isset($GLOBALS["kitab"]) || get_class($GLOBALS["kitab"]) == PROJECT_NAMESPACE . "kitab") {
			$GLOBALS["kitab"] = &$this;
			$GLOBALS["Table"] = &$GLOBALS["kitab"];
		}

		// Page ID (for backward compatibility only)
		if (!defined(PROJECT_NAMESPACE . "PAGE_ID"))
			define(PROJECT_NAMESPACE . "PAGE_ID", 'add');

		// Table name (for backward compatibility only)
		if (!defined(PROJECT_NAMESPACE . "TABLE_NAME"))
			define(PROJECT_NAMESPACE . "TABLE_NAME", 'kitab');

		// Start timer
		if (!isset($GLOBALS["DebugTimer"]))
			$GLOBALS["DebugTimer"] = new Timer();

		// Debug message
		LoadDebugMessage();

		// Open connection
		if (!isset($GLOBALS["Conn"]))
			$GLOBALS["Conn"] = $this->getConnection();
	}

	// Terminate page
	public function terminate($url = "")
	{
		global $ExportFileName, $TempImages, $DashboardReport;

		// Export
		global $kitab;
		if ($this->CustomExport && $this->CustomExport == $this->Export && array_key_exists($this->CustomExport, Config("EXPORT_CLASSES"))) {
				$content = ob_get_contents();
			if ($ExportFileName == "")
				$ExportFileName = $this->TableVar;
			$class = PROJECT_NAMESPACE . Config("EXPORT_CLASSES." . $this->CustomExport);
			if (class_exists($class)) {
				$doc = new $class($kitab);
				$doc->Text = @$content;
				if ($this->isExport("email"))
					echo $this->exportEmail($doc->Text);
				else
					$doc->export();
				DeleteTempImages(); // Delete temp images
				exit();
			}
		}

		// Close connection
		CloseConnections();

		// Return for API
		if (IsApi()) {
			$res = $url === TRUE;
			if (!$res) // Show error
				WriteJson(array_merge(["success" => FALSE], $this->getMessages()));
			return;
		}

		// Go to URL if specified
		if ($url != "") {
			if (!Config("DEBUG") && ob_get_length())
				ob_end_clean();

			// Handle modal response
			if ($this->IsModal) { // Show as modal
				$row = ["url" => $url, "modal" => "1"];
				$pageName = GetPageName($url);
				if ($pageName != $this->getListUrl()) { // Not List page
					$row["caption"] = $this->getModalCaption($pageName);
					if ($pageName == "")
						$row["view"] = "1";
				} else { // List page should not be shown as modal => error
					$row["error"] = $this->getFailureMessage();
					$this->clearFailureMessage();
				}
				WriteJson($row);
			} else {
				SaveDebugMessage();
				AddHeader("Location", $url);
			}
		}
		exit();
	}

	// Get records from recordset
	protected function getRecordsFromRecordset($rs, $current = FALSE)
	{
		$rows = [];
		if (is_object($rs)) { // Recordset
			while ($rs && !$rs->EOF) {
				$this->loadRowValues($rs); // Set up DbValue/CurrentValue
				$row = $this->getRecordFromArray($rs->fields);
				if ($current)
					return $row;
				else
					$rows[] = $row;
				$rs->moveNext();
			}
		} elseif (is_array($rs)) {
			foreach ($rs as $ar) {
				$row = $this->getRecordFromArray($ar);
				if ($current)
					return $row;
				else
					$rows[] = $row;
			}
		}
		return $rows;
	}

	// Get record from array
	protected function getRecordFromArray($ar)
	{
		$row = [];
		if (is_array($ar)) {
			foreach ($ar as $fldname => $val) {
				if (array_key_exists($fldname, $this->fields) && ($this->fields[$fldname]->Visible || $this->fields[$fldname]->IsPrimaryKey)) { // Primary key or Visible
					$fld = &$this->fields[$fldname];
					if ($fld->HtmlTag == "FILE") { // Upload field
						if (EmptyValue($val)) {
							$row[$fldname] = NULL;
						} else {
							if ($fld->DataType == DATATYPE_BLOB) {
								$url = FullUrl(GetApiUrl(Config("API_FILE_ACTION"),
									Config("API_OBJECT_NAME") . "=" . $fld->TableVar . "&" .
									Config("API_FIELD_NAME") . "=" . $fld->Param . "&" .
									Config("API_KEY_NAME") . "=" . rawurlencode($this->getRecordKeyValue($ar)))); //*** need to add this? API may not be in the same folder
								$row[$fldname] = ["type" => ContentType($val), "url" => $url, "name" => $fld->Param . ContentExtension($val)];
							} elseif (!$fld->UploadMultiple || !ContainsString($val, Config("MULTIPLE_UPLOAD_SEPARATOR"))) { // Single file
								$url = FullUrl(GetApiUrl(Config("API_FILE_ACTION"),
									Config("API_OBJECT_NAME") . "=" . $fld->TableVar . "&" .
									"fn=" . Encrypt($fld->physicalUploadPath() . $val)));
								$row[$fldname] = ["type" => MimeContentType($val), "url" => $url, "name" => $val];
							} else { // Multiple files
								$files = explode(Config("MULTIPLE_UPLOAD_SEPARATOR"), $val);
								$ar = [];
								foreach ($files as $file) {
									$url = FullUrl(GetApiUrl(Config("API_FILE_ACTION"),
										Config("API_OBJECT_NAME") . "=" . $fld->TableVar . "&" .
										"fn=" . Encrypt($fld->physicalUploadPath() . $file)));
									if (!EmptyValue($file))
										$ar[] = ["type" => MimeContentType($file), "url" => $url, "name" => $file];
								}
								$row[$fldname] = $ar;
							}
						}
					} else {
						$row[$fldname] = $val;
					}
				}
			}
		}
		return $row;
	}

	// Get record key value from array
	protected function getRecordKeyValue($ar)
	{
		$key = "";
		if (is_array($ar)) {
			$key .= @$ar['id'];
		}
		return $key;
	}

	/**
	 * Hide fields for add/edit
	 *
	 * @return void
	 */
	protected function hideFieldsForAddEdit()
	{
		if ($this->isAdd() || $this->isCopy() || $this->isGridAdd())
			$this->id->Visible = FALSE;
	}

	// Lookup data
	public function lookup()
	{
		global $Language, $Security;
		if (!isset($Language))
			$Language = new Language(Config("LANGUAGE_FOLDER"), Post("language", ""));

		// Set up API request
		if (!ValidApiRequest())
			return FALSE;
		$this->setupApiSecurity();

		// Get lookup object
		$fieldName = Post("field");
		if (!array_key_exists($fieldName, $this->fields))
			return FALSE;
		$lookupField = $this->fields[$fieldName];
		$lookup = $lookupField->Lookup;
		if ($lookup === NULL)
			return FALSE;

		// Get lookup parameters
		$lookupType = Post("ajax", "unknown");
		$pageSize = -1;
		$offset = -1;
		$searchValue = "";
		if (SameText($lookupType, "modal")) {
			$searchValue = Post("sv", "");
			$pageSize = Post("recperpage", 10);
			$offset = Post("start", 0);
		} elseif (SameText($lookupType, "autosuggest")) {
			$searchValue = Param("q", "");
			$pageSize = Param("n", -1);
			$pageSize = is_numeric($pageSize) ? (int)$pageSize : -1;
			if ($pageSize <= 0)
				$pageSize = Config("AUTO_SUGGEST_MAX_ENTRIES");
			$start = Param("start", -1);
			$start = is_numeric($start) ? (int)$start : -1;
			$page = Param("page", -1);
			$page = is_numeric($page) ? (int)$page : -1;
			$offset = $start >= 0 ? $start : ($page > 0 && $pageSize > 0 ? ($page - 1) * $pageSize : 0);
		}
		$userSelect = Decrypt(Post("s", ""));
		$userFilter = Decrypt(Post("f", ""));
		$userOrderBy = Decrypt(Post("o", ""));
		$keys = Post("keys");
		$lookup->LookupType = $lookupType; // Lookup type
		if ($keys !== NULL) { // Selected records from modal
			if (is_array($keys))
				$keys = implode(Config("MULTIPLE_OPTION_SEPARATOR"), $keys);
			$lookup->FilterFields = []; // Skip parent fields if any
			$lookup->FilterValues[] = $keys; // Lookup values
			$pageSize = -1; // Show all records
		} else { // Lookup values
			$lookup->FilterValues[] = Post("v0", Post("lookupValue", ""));
		}
		$cnt = is_array($lookup->FilterFields) ? count($lookup->FilterFields) : 0;
		for ($i = 1; $i <= $cnt; $i++)
			$lookup->FilterValues[] = Post("v" . $i, "");
		$lookup->SearchValue = $searchValue;
		$lookup->PageSize = $pageSize;
		$lookup->Offset = $offset;
		if ($userSelect != "")
			$lookup->UserSelect = $userSelect;
		if ($userFilter != "")
			$lookup->UserFilter = $userFilter;
		if ($userOrderBy != "")
			$lookup->UserOrderBy = $userOrderBy;
		$lookup->toJson($this); // Use settings from current page
	}

	// Set up API security
	public function setupApiSecurity()
	{
		global $Security;

		// Setup security for API request
	}
	public $FormClassName = "ew-horizontal ew-form ew-add-form";
	public $IsModal = FALSE;
	public $IsMobileOrModal = FALSE;
	public $DbMasterFilter = "";
	public $DbDetailFilter = "";
	public $StartRecord;
	public $Priv = 0;
	public $OldRecordset;
	public $CopyRecord;

	//
	// Page run
	//

	public function run()
	{
		global $ExportType, $CustomExportType, $ExportFileName, $UserProfile, $Language, $Security, $CurrentForm,
			$FormError, $SkipHeaderFooter;

		// Is modal
		$this->IsModal = (Param("modal") == "1");

		// User profile
		$UserProfile = new UserProfile();

		// Security
		if (ValidApiRequest()) { // API request
			$this->setupApiSecurity(); // Set up API Security
		} else {
			$Security = new AdvancedSecurity();
		}

		// Create form object
		$CurrentForm = new HttpForm();
		$this->CurrentAction = Param("action"); // Set up current action
		$this->id->Visible = FALSE;
		$this->judul->setVisibility();
		$this->pengarang->setVisibility();
		$this->keterangan->setVisibility();
		$this->sampul->setVisibility();
		$this->thn_terbit->setVisibility();
		$this->tag->setVisibility();
		$this->u_by->Visible = FALSE;
		$this->i_by->Visible = FALSE;
		$this->validasi_by->Visible = FALSE;
		$this->u_date->Visible = FALSE;
		$this->i_date->Visible = FALSE;
		$this->validasi_date->Visible = FALSE;
		$this->aktif->setVisibility();
		$this->hideFieldsForAddEdit();

		// Do not use lookup cache
		$this->setUseLookupCache(FALSE);

		// Check token
		if (!$this->validPost()) {
			Write($Language->phrase("InvalidPostRequest"));
			$this->terminate();
		}

		// Create Token
		$this->createToken();

		// Set up lookup cache
		// Check modal

		if ($this->IsModal)
			$SkipHeaderFooter = TRUE;
		$this->IsMobileOrModal = IsMobile() || $this->IsModal;
		$this->FormClassName = "ew-form ew-add-form ew-horizontal";
		$postBack = FALSE;

		// Set up current action
		if (IsApi()) {
			$this->CurrentAction = "insert"; // Add record directly
			$postBack = TRUE;
		} elseif (Post("action") !== NULL) {
			$this->CurrentAction = Post("action"); // Get form action
			$postBack = TRUE;
		} else { // Not post back

			// Load key values from QueryString
			$this->CopyRecord = TRUE;
			if (Get("id") !== NULL) {
				$this->id->setQueryStringValue(Get("id"));
				$this->setKey("id", $this->id->CurrentValue); // Set up key
			} else {
				$this->setKey("id", ""); // Clear key
				$this->CopyRecord = FALSE;
			}
			if ($this->CopyRecord) {
				$this->CurrentAction = "copy"; // Copy record
			} else {
				$this->CurrentAction = "show"; // Display blank record
			}
		}

		// Load old record / default values
		$loaded = $this->loadOldRecord();

		// Load form values
		if ($postBack) {
			$this->loadFormValues(); // Load form values
		}

		// Set up detail parameters
		$this->setupDetailParms();

		// Validate form if post back
		if ($postBack) {
			if (!$this->validateForm()) {
				$this->EventCancelled = TRUE; // Event cancelled
				$this->restoreFormValues(); // Restore form values
				$this->setFailureMessage($FormError);
				if (IsApi()) {
					$this->terminate();
					return;
				} else {
					$this->CurrentAction = "show"; // Form error, reset action
				}
			}
		}

		// Perform current action
		switch ($this->CurrentAction) {
			case "copy": // Copy an existing record
				if (!$loaded) { // Record not loaded
					if ($this->getFailureMessage() == "")
						$this->setFailureMessage($Language->phrase("NoRecord")); // No record found
					$this->terminate(""); // No matching record, return to list
				}

				// Set up detail parameters
				$this->setupDetailParms();
				break;
			case "insert": // Add new record
				$this->SendEmail = TRUE; // Send email on add success
				if ($this->addRow($this->OldRecordset)) { // Add successful
					if ($this->getSuccessMessage() == "")
						$this->setSuccessMessage($Language->phrase("AddSuccess")); // Set up success message
					if ($this->getCurrentDetailTable() != "") // Master/detail add
						$returnUrl = $this->getDetailUrl();
					else
						$returnUrl = $this->getReturnUrl();
					if (GetPageName($returnUrl) == "")
						$returnUrl = $this->addMasterUrl($returnUrl); // List page, return to List page with correct master key if necessary
					elseif (GetPageName($returnUrl) == "")
						$returnUrl = $this->getViewUrl(); // View page, return to View page with keyurl directly
					if (IsApi()) { // Return to caller
						$this->terminate(TRUE);
						return;
					} else {
						$this->terminate($returnUrl);
					}
				} elseif (IsApi()) { // API request, return
					$this->terminate();
					return;
				} else {
					$this->EventCancelled = TRUE; // Event cancelled
					$this->restoreFormValues(); // Add failed, restore form values

					// Set up detail parameters
					$this->setupDetailParms();
				}
		}

		// Set up Breadcrumb
		$this->setupBreadcrumb();

		// Render row based on row type
		$this->RowType = ROWTYPE_ADD; // Render add type

		// Render row
		$this->resetAttributes();
		$this->renderRow();
	}

	// Get upload files
	protected function getUploadFiles()
	{
		global $CurrentForm, $Language;
		$this->sampul->Upload->Index = $CurrentForm->Index;
		$this->sampul->Upload->uploadFile();
	}

	// Load default values
	protected function loadDefaultValues()
	{
		$this->id->CurrentValue = NULL;
		$this->id->OldValue = $this->id->CurrentValue;
		$this->judul->CurrentValue = NULL;
		$this->judul->OldValue = $this->judul->CurrentValue;
		$this->pengarang->CurrentValue = NULL;
		$this->pengarang->OldValue = $this->pengarang->CurrentValue;
		$this->keterangan->CurrentValue = NULL;
		$this->keterangan->OldValue = $this->keterangan->CurrentValue;
		$this->sampul->Upload->DbValue = NULL;
		$this->sampul->OldValue = $this->sampul->Upload->DbValue;
		$this->thn_terbit->CurrentValue = NULL;
		$this->thn_terbit->OldValue = $this->thn_terbit->CurrentValue;
		$this->tag->CurrentValue = NULL;
		$this->tag->OldValue = $this->tag->CurrentValue;
		$this->u_by->CurrentValue = NULL;
		$this->u_by->OldValue = $this->u_by->CurrentValue;
		$this->i_by->CurrentValue = NULL;
		$this->i_by->OldValue = $this->i_by->CurrentValue;
		$this->validasi_by->CurrentValue = NULL;
		$this->validasi_by->OldValue = $this->validasi_by->CurrentValue;
		$this->u_date->CurrentValue = NULL;
		$this->u_date->OldValue = $this->u_date->CurrentValue;
		$this->i_date->CurrentValue = NULL;
		$this->i_date->OldValue = $this->i_date->CurrentValue;
		$this->validasi_date->CurrentValue = NULL;
		$this->validasi_date->OldValue = $this->validasi_date->CurrentValue;
		$this->aktif->CurrentValue = NULL;
		$this->aktif->OldValue = $this->aktif->CurrentValue;
	}

	// Load form values
	protected function loadFormValues()
	{

		// Load from form
		global $CurrentForm;

		// Check field name 'judul' first before field var 'judul'
		$val = $CurrentForm->hasValue("judul") ? $CurrentForm->getValue("judul") : $CurrentForm->getValue("judul");
		if (!$this->judul->IsDetailKey) {
			if (IsApi() && $val === NULL)
				$this->judul->Visible = FALSE; // Disable update for API request
			else
				$this->judul->setFormValue($val);
		}

		// Check field name 'pengarang' first before field var 'pengarang'
		$val = $CurrentForm->hasValue("pengarang") ? $CurrentForm->getValue("pengarang") : $CurrentForm->getValue("pengarang");
		if (!$this->pengarang->IsDetailKey) {
			if (IsApi() && $val === NULL)
				$this->pengarang->Visible = FALSE; // Disable update for API request
			else
				$this->pengarang->setFormValue($val);
		}

		// Check field name 'keterangan' first before field var 'keterangan'
		$val = $CurrentForm->hasValue("keterangan") ? $CurrentForm->getValue("keterangan") : $CurrentForm->getValue("keterangan");
		if (!$this->keterangan->IsDetailKey) {
			if (IsApi() && $val === NULL)
				$this->keterangan->Visible = FALSE; // Disable update for API request
			else
				$this->keterangan->setFormValue($val);
		}

		// Check field name 'thn_terbit' first before field var 'thn_terbit'
		$val = $CurrentForm->hasValue("thn_terbit") ? $CurrentForm->getValue("thn_terbit") : $CurrentForm->getValue("thn_terbit");
		if (!$this->thn_terbit->IsDetailKey) {
			if (IsApi() && $val === NULL)
				$this->thn_terbit->Visible = FALSE; // Disable update for API request
			else
				$this->thn_terbit->setFormValue($val);
		}

		// Check field name 'tag' first before field var 'tag'
		$val = $CurrentForm->hasValue("tag") ? $CurrentForm->getValue("tag") : $CurrentForm->getValue("tag");
		if (!$this->tag->IsDetailKey) {
			if (IsApi() && $val === NULL)
				$this->tag->Visible = FALSE; // Disable update for API request
			else
				$this->tag->setFormValue($val);
		}

		// Check field name 'aktif' first before field var 'aktif'
		$val = $CurrentForm->hasValue("aktif") ? $CurrentForm->getValue("aktif") : $CurrentForm->getValue("aktif");
		if (!$this->aktif->IsDetailKey) {
			if (IsApi() && $val === NULL)
				$this->aktif->Visible = FALSE; // Disable update for API request
			else
				$this->aktif->setFormValue($val);
		}

		// Check field name 'id' first before field var 'id'
		$val = $CurrentForm->hasValue("id") ? $CurrentForm->getValue("id") : $CurrentForm->getValue("id");
		$this->getUploadFiles(); // Get upload files
	}

	// Restore form values
	public function restoreFormValues()
	{
		global $CurrentForm;
		$this->judul->CurrentValue = $this->judul->FormValue;
		$this->pengarang->CurrentValue = $this->pengarang->FormValue;
		$this->keterangan->CurrentValue = $this->keterangan->FormValue;
		$this->thn_terbit->CurrentValue = $this->thn_terbit->FormValue;
		$this->tag->CurrentValue = $this->tag->FormValue;
		$this->aktif->CurrentValue = $this->aktif->FormValue;
	}

	// Load row based on key values
	public function loadRow()
	{
		global $Security, $Language;
		$filter = $this->getRecordFilter();

		// Load SQL based on filter
		$this->CurrentFilter = $filter;
		$sql = $this->getCurrentSql();
		$conn = $this->getConnection();
		$res = FALSE;
		$rs = LoadRecordset($sql, $conn);
		if ($rs && !$rs->EOF) {
			$res = TRUE;
			$this->loadRowValues($rs); // Load row values
			$rs->close();
		}
		return $res;
	}

	// Load row values from recordset
	public function loadRowValues($rs = NULL)
	{
		if ($rs && !$rs->EOF)
			$row = $rs->fields;
		else
			$row = $this->newRow();
		if (!$rs || $rs->EOF)
			return;
		$this->id->setDbValue($row['id']);
		$this->judul->setDbValue($row['judul']);
		$this->pengarang->setDbValue($row['pengarang']);
		$this->keterangan->setDbValue($row['keterangan']);
		$this->sampul->Upload->DbValue = $row['sampul'];
		$this->sampul->setDbValue($this->sampul->Upload->DbValue);
		$this->thn_terbit->setDbValue($row['thn_terbit']);
		$this->tag->setDbValue($row['tag']);
		$this->u_by->setDbValue($row['u_by']);
		$this->i_by->setDbValue($row['i_by']);
		$this->validasi_by->setDbValue($row['validasi_by']);
		$this->u_date->setDbValue($row['u_date']);
		$this->i_date->setDbValue($row['i_date']);
		$this->validasi_date->setDbValue($row['validasi_date']);
		$this->aktif->setDbValue($row['aktif']);
	}

	// Return a row with default values
	protected function newRow()
	{
		$this->loadDefaultValues();
		$row = [];
		$row['id'] = $this->id->CurrentValue;
		$row['judul'] = $this->judul->CurrentValue;
		$row['pengarang'] = $this->pengarang->CurrentValue;
		$row['keterangan'] = $this->keterangan->CurrentValue;
		$row['sampul'] = $this->sampul->Upload->DbValue;
		$row['thn_terbit'] = $this->thn_terbit->CurrentValue;
		$row['tag'] = $this->tag->CurrentValue;
		$row['u_by'] = $this->u_by->CurrentValue;
		$row['i_by'] = $this->i_by->CurrentValue;
		$row['validasi_by'] = $this->validasi_by->CurrentValue;
		$row['u_date'] = $this->u_date->CurrentValue;
		$row['i_date'] = $this->i_date->CurrentValue;
		$row['validasi_date'] = $this->validasi_date->CurrentValue;
		$row['aktif'] = $this->aktif->CurrentValue;
		return $row;
	}

	// Load old record
	protected function loadOldRecord()
	{

		// Load key values from Session
		$validKey = TRUE;
		if (strval($this->getKey("id")) != "")
			$this->id->OldValue = $this->getKey("id"); // id
		else
			$validKey = FALSE;

		// Load old record
		$this->OldRecordset = NULL;
		if ($validKey) {
			$this->CurrentFilter = $this->getRecordFilter();
			$sql = $this->getCurrentSql();
			$conn = $this->getConnection();
			$this->OldRecordset = LoadRecordset($sql, $conn);
		}
		$this->loadRowValues($this->OldRecordset); // Load row values
		return $validKey;
	}

	// Render row values based on field settings
	public function renderRow()
	{
		global $Security, $Language, $CurrentLanguage;

		// Initialize URLs
		// Common render codes for all row types
		// id
		// judul
		// pengarang
		// keterangan
		// sampul
		// thn_terbit
		// tag
		// u_by
		// i_by
		// validasi_by
		// u_date
		// i_date
		// validasi_date
		// aktif

		if ($this->RowType == ROWTYPE_VIEW) { // View row

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

			// aktif
			if (strval($this->aktif->CurrentValue) != "") {
				$this->aktif->ViewValue = $this->aktif->optionCaption($this->aktif->CurrentValue);
			} else {
				$this->aktif->ViewValue = NULL;
			}
			$this->aktif->ViewCustomAttributes = "";

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

			// aktif
			$this->aktif->LinkCustomAttributes = "";
			$this->aktif->HrefValue = "";
			$this->aktif->TooltipValue = "";
		} elseif ($this->RowType == ROWTYPE_ADD) { // Add row

			// judul
			$this->judul->EditAttrs["class"] = "form-control";
			$this->judul->EditCustomAttributes = "";
			if (!$this->judul->Raw)
				$this->judul->CurrentValue = HtmlDecode($this->judul->CurrentValue);
			$this->judul->EditValue = HtmlEncode($this->judul->CurrentValue);
			$this->judul->PlaceHolder = RemoveHtml($this->judul->caption());

			// pengarang
			$this->pengarang->EditAttrs["class"] = "form-control";
			$this->pengarang->EditCustomAttributes = "";
			if (!$this->pengarang->Raw)
				$this->pengarang->CurrentValue = HtmlDecode($this->pengarang->CurrentValue);
			$this->pengarang->EditValue = HtmlEncode($this->pengarang->CurrentValue);
			$this->pengarang->PlaceHolder = RemoveHtml($this->pengarang->caption());

			// keterangan
			$this->keterangan->EditAttrs["class"] = "form-control";
			$this->keterangan->EditCustomAttributes = "";
			if (!$this->keterangan->Raw)
				$this->keterangan->CurrentValue = HtmlDecode($this->keterangan->CurrentValue);
			$this->keterangan->EditValue = HtmlEncode($this->keterangan->CurrentValue);
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
			if ($this->isShow() || $this->isCopy())
				RenderUploadField($this->sampul);

			// thn_terbit
			$this->thn_terbit->EditAttrs["class"] = "form-control";
			$this->thn_terbit->EditCustomAttributes = "";
			$this->thn_terbit->EditValue = HtmlEncode($this->thn_terbit->CurrentValue);
			$this->thn_terbit->PlaceHolder = RemoveHtml($this->thn_terbit->caption());

			// tag
			$this->tag->EditAttrs["class"] = "form-control";
			$this->tag->EditCustomAttributes = "";
			if (!$this->tag->Raw)
				$this->tag->CurrentValue = HtmlDecode($this->tag->CurrentValue);
			$this->tag->EditValue = HtmlEncode($this->tag->CurrentValue);
			$this->tag->PlaceHolder = RemoveHtml($this->tag->caption());

			// aktif
			$this->aktif->EditCustomAttributes = "";
			$this->aktif->EditValue = $this->aktif->options(FALSE);

			// Add refer script
			// judul

			$this->judul->LinkCustomAttributes = "";
			$this->judul->HrefValue = "";

			// pengarang
			$this->pengarang->LinkCustomAttributes = "";
			$this->pengarang->HrefValue = "";

			// keterangan
			$this->keterangan->LinkCustomAttributes = "";
			$this->keterangan->HrefValue = "";

			// sampul
			$this->sampul->LinkCustomAttributes = "";
			$this->sampul->HrefValue = "";
			$this->sampul->ExportHrefValue = $this->sampul->UploadPath . $this->sampul->Upload->DbValue;

			// thn_terbit
			$this->thn_terbit->LinkCustomAttributes = "";
			$this->thn_terbit->HrefValue = "";

			// tag
			$this->tag->LinkCustomAttributes = "";
			$this->tag->HrefValue = "";

			// aktif
			$this->aktif->LinkCustomAttributes = "";
			$this->aktif->HrefValue = "";
		}
		if ($this->RowType == ROWTYPE_ADD || $this->RowType == ROWTYPE_EDIT || $this->RowType == ROWTYPE_SEARCH) // Add/Edit/Search row
			$this->setupFieldTitles();
	}

	// Validate form
	protected function validateForm()
	{
		global $Language, $FormError;

		// Initialize form error message
		$FormError = "";

		// Check if validation required
		if (!Config("SERVER_VALIDATE"))
			return ($FormError == "");
		if ($this->judul->Required) {
			if (!$this->judul->IsDetailKey && $this->judul->FormValue != NULL && $this->judul->FormValue == "") {
				AddMessage($FormError, str_replace("%s", $this->judul->caption(), $this->judul->RequiredErrorMessage));
			}
		}
		if ($this->pengarang->Required) {
			if (!$this->pengarang->IsDetailKey && $this->pengarang->FormValue != NULL && $this->pengarang->FormValue == "") {
				AddMessage($FormError, str_replace("%s", $this->pengarang->caption(), $this->pengarang->RequiredErrorMessage));
			}
		}
		if ($this->keterangan->Required) {
			if (!$this->keterangan->IsDetailKey && $this->keterangan->FormValue != NULL && $this->keterangan->FormValue == "") {
				AddMessage($FormError, str_replace("%s", $this->keterangan->caption(), $this->keterangan->RequiredErrorMessage));
			}
		}
		if ($this->sampul->Required) {
			if ($this->sampul->Upload->FileName == "" && !$this->sampul->Upload->KeepFile) {
				AddMessage($FormError, str_replace("%s", $this->sampul->caption(), $this->sampul->RequiredErrorMessage));
			}
		}
		if ($this->thn_terbit->Required) {
			if (!$this->thn_terbit->IsDetailKey && $this->thn_terbit->FormValue != NULL && $this->thn_terbit->FormValue == "") {
				AddMessage($FormError, str_replace("%s", $this->thn_terbit->caption(), $this->thn_terbit->RequiredErrorMessage));
			}
		}
		if (!CheckInteger($this->thn_terbit->FormValue)) {
			AddMessage($FormError, $this->thn_terbit->errorMessage());
		}
		if ($this->tag->Required) {
			if (!$this->tag->IsDetailKey && $this->tag->FormValue != NULL && $this->tag->FormValue == "") {
				AddMessage($FormError, str_replace("%s", $this->tag->caption(), $this->tag->RequiredErrorMessage));
			}
		}
		if ($this->aktif->Required) {
			if ($this->aktif->FormValue == "") {
				AddMessage($FormError, str_replace("%s", $this->aktif->caption(), $this->aktif->RequiredErrorMessage));
			}
		}

		// Validate detail grid
		$detailTblVar = explode(",", $this->getCurrentDetailTable());

		// Return validate result
		$validateForm = ($FormError == "");
		return $validateForm;
	}

	// Add record
	protected function addRow($rsold = NULL)
	{
		global $Language, $Security;
		$conn = $this->getConnection();

		// Begin transaction
		if ($this->getCurrentDetailTable() != "")
			$conn->beginTrans();

		// Load db values from rsold
		$this->loadDbValues($rsold);
		if ($rsold) {
		}
		$rsnew = [];

		// judul
		$this->judul->setDbValueDef($rsnew, $this->judul->CurrentValue, NULL, FALSE);

		// pengarang
		$this->pengarang->setDbValueDef($rsnew, $this->pengarang->CurrentValue, NULL, FALSE);

		// keterangan
		$this->keterangan->setDbValueDef($rsnew, $this->keterangan->CurrentValue, NULL, FALSE);

		// sampul
		if ($this->sampul->Visible && !$this->sampul->Upload->KeepFile) {
			$this->sampul->Upload->DbValue = ""; // No need to delete old file
			if ($this->sampul->Upload->FileName == "") {
				$rsnew['sampul'] = NULL;
			} else {
				$rsnew['sampul'] = $this->sampul->Upload->FileName;
			}
		}

		// thn_terbit
		$this->thn_terbit->setDbValueDef($rsnew, $this->thn_terbit->CurrentValue, NULL, FALSE);

		// tag
		$this->tag->setDbValueDef($rsnew, $this->tag->CurrentValue, NULL, FALSE);

		// aktif
		$this->aktif->setDbValueDef($rsnew, $this->aktif->CurrentValue, NULL, FALSE);
		if ($this->sampul->Visible && !$this->sampul->Upload->KeepFile) {
			$oldFiles = EmptyValue($this->sampul->Upload->DbValue) ? [] : [$this->sampul->htmlDecode($this->sampul->Upload->DbValue)];
			if (!EmptyValue($this->sampul->Upload->FileName)) {
				$newFiles = [$this->sampul->Upload->FileName];
				$NewFileCount = count($newFiles);
				for ($i = 0; $i < $NewFileCount; $i++) {
					if ($newFiles[$i] != "") {
						$file = $newFiles[$i];
						$tempPath = UploadTempPath($this->sampul, $this->sampul->Upload->Index);
						if (file_exists($tempPath . $file)) {
							if (Config("DELETE_UPLOADED_FILES")) {
								$oldFileFound = FALSE;
								$oldFileCount = count($oldFiles);
								for ($j = 0; $j < $oldFileCount; $j++) {
									$oldFile = $oldFiles[$j];
									if ($oldFile == $file) { // Old file found, no need to delete anymore
										array_splice($oldFiles, $j, 1);
										$oldFileFound = TRUE;
										break;
									}
								}
								if ($oldFileFound) // No need to check if file exists further
									continue;
							}
							$file1 = UniqueFilename($this->sampul->physicalUploadPath(), $file); // Get new file name
							if ($file1 != $file) { // Rename temp file
								while (file_exists($tempPath . $file1) || file_exists($this->sampul->physicalUploadPath() . $file1)) // Make sure no file name clash
									$file1 = UniqueFilename($this->sampul->physicalUploadPath(), $file1, TRUE); // Use indexed name
								rename($tempPath . $file, $tempPath . $file1);
								$newFiles[$i] = $file1;
							}
						}
					}
				}
				$this->sampul->Upload->DbValue = empty($oldFiles) ? "" : implode(Config("MULTIPLE_UPLOAD_SEPARATOR"), $oldFiles);
				$this->sampul->Upload->FileName = implode(Config("MULTIPLE_UPLOAD_SEPARATOR"), $newFiles);
				$this->sampul->setDbValueDef($rsnew, $this->sampul->Upload->FileName, NULL, FALSE);
			}
		}
		$insertRow = TRUE;
		if ($insertRow) {
			$conn->raiseErrorFn = Config("ERROR_FUNC");
			$addRow = $this->insert($rsnew);
			$conn->raiseErrorFn = "";
			if ($addRow) {
				if ($this->sampul->Visible && !$this->sampul->Upload->KeepFile) {
					$oldFiles = EmptyValue($this->sampul->Upload->DbValue) ? [] : [$this->sampul->htmlDecode($this->sampul->Upload->DbValue)];
					if (!EmptyValue($this->sampul->Upload->FileName)) {
						$newFiles = [$this->sampul->Upload->FileName];
						$newFiles2 = [$this->sampul->htmlDecode($rsnew['sampul'])];
						$newFileCount = count($newFiles);
						for ($i = 0; $i < $newFileCount; $i++) {
							if ($newFiles[$i] != "") {
								$file = UploadTempPath($this->sampul, $this->sampul->Upload->Index) . $newFiles[$i];
								if (file_exists($file)) {
									if (@$newFiles2[$i] != "") // Use correct file name
										$newFiles[$i] = $newFiles2[$i];
									if (!$this->sampul->Upload->SaveToFile($newFiles[$i], TRUE, $i)) { // Just replace
										$this->setFailureMessage($Language->phrase("UploadErrMsg7"));
										return FALSE;
									}
								}
							}
						}
					} else {
						$newFiles = [];
					}
					if (Config("DELETE_UPLOADED_FILES")) {
						foreach ($oldFiles as $oldFile) {
							if ($oldFile != "" && !in_array($oldFile, $newFiles))
								@unlink($this->sampul->oldPhysicalUploadPath() . $oldFile);
						}
					}
				}
			}
		} else {
			if ($this->getSuccessMessage() != "" || $this->getFailureMessage() != "") {

				// Use the message, do nothing
			} elseif ($this->CancelMessage != "") {
				$this->setFailureMessage($this->CancelMessage);
				$this->CancelMessage = "";
			} else {
				$this->setFailureMessage($Language->phrase("InsertCancelled"));
			}
			$addRow = FALSE;
		}

		// Add detail records
		if ($addRow) {
			$detailTblVar = explode(",", $this->getCurrentDetailTable());
		}

		// Commit/Rollback transaction
		if ($this->getCurrentDetailTable() != "") {
			if ($addRow) {
				$conn->commitTrans(); // Commit transaction
			} else {
				$conn->rollbackTrans(); // Rollback transaction
			}
		}
		if ($addRow) {
		}

		// Clean upload path if any
		if ($addRow) {

			// sampul
			CleanUploadTempPath($this->sampul, $this->sampul->Upload->Index);
		}

		// Write JSON for API request
		if (IsApi() && $addRow) {
			$row = $this->getRecordsFromRecordset([$rsnew], TRUE);
			WriteJson(["success" => TRUE, $this->TableVar => $row]);
		}
		return $addRow;
	}

	// Set up detail parms based on QueryString
	protected function setupDetailParms()
	{

		// Get the keys for master table
		$detailTblVar = Get(Config("TABLE_SHOW_DETAIL"));
		if ($detailTblVar !== NULL) {
			$this->setCurrentDetailTable($detailTblVar);
		} else {
			$detailTblVar = $this->getCurrentDetailTable();
		}
		if ($detailTblVar != "") {
			$detailTblVar = explode(",", $detailTblVar);
		}
	}

	// Set up Breadcrumb
	protected function setupBreadcrumb()
	{
		global $Breadcrumb, $Language;
		$Breadcrumb = new Breadcrumb();
		$url = substr(CurrentUrl(), strrpos(CurrentUrl(), "/")+1);
		$Breadcrumb->add("list", $this->TableVar, $this->addMasterUrl(""), "", $this->TableVar, TRUE);
		$pageId = ($this->isCopy()) ? "Copy" : "Add";
		$Breadcrumb->add("add", $pageId, $url);
	}

	// Setup lookup options
	public function setupLookupOptions($fld)
	{
		if ($fld->Lookup !== NULL && $fld->Lookup->Options === NULL) {

			// Get default connection and filter
			$conn = $this->getConnection();
			$lookupFilter = "";

			// No need to check any more
			$fld->Lookup->Options = [];

			// Set up lookup SQL and connection
			switch ($fld->FieldVar) {
				case "aktif":
					break;
				default:
					$lookupFilter = "";
					break;
			}

			// Always call to Lookup->getSql so that user can setup Lookup->Options in Lookup_Selecting server event
			$sql = $fld->Lookup->getSql(FALSE, "", $lookupFilter, $this);

			// Set up lookup cache
			if ($fld->UseLookupCache && $sql != "" && count($fld->Lookup->Options) == 0) {
				$totalCnt = $this->getRecordCount($sql, $conn);
				if ($totalCnt > $fld->LookupCacheCount) // Total count > cache count, do not cache
					return;
				$rs = $conn->execute($sql);
				$ar = [];
				while ($rs && !$rs->EOF) {
					$row = &$rs->fields;

					// Format the field values
					switch ($fld->FieldVar) {
					}
					$ar[strval($row[0])] = $row;
					$rs->moveNext();
				}
				if ($rs)
					$rs->close();
				$fld->Lookup->Options = $ar;
			}
		}
	}
} // End class
?>