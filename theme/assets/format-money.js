// Language ISO Code: {{ localization.language.iso_code }}
// Currency ISO Code: {{ localization.country.currency.iso_code }}

const formatMoney = (cents, languageISOCode, currencyISOCode) => {
	const dollars = (cents / 100).toFixed(2);

	return new Intl.NumberFormat(languageISOCode, {
		style: "currency",
		currency: currencyISOCode,
	}).format(dollars);
};
