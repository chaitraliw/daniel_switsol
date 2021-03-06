frappe.ui.form.on("Quotation Item",{
	item_code:function(frm,cdt,cdn){
		var d = locals[cdt][cdn];
		setTimeout(function() { add_sales_team(d) }, 1000);
	},
	qty:function(frm,cdt,cdn){
		var d = locals[cdt][cdn];
		if(cur_frm.doc.quotation_sales_person.length > 0){
			$.each(cur_frm.doc.quotation_sales_person,function(i,j){
				if(j['sp_id'] == d.item_code+"-"+d.idx){
					console.log(j['sales_person'],i)
					cur_frm.doc.quotation_sales_person[i]['commission'] = (d.rate*d.qty)*flt(j['commission_rate'])/100
					cur_frm.doc.quotation_sales_person[i]['item_qty'] = d.qty
				}
			})
			refresh_field("quotation_sales_person")
		}
	},
	rate:function(frm,cdt,cdn){
		var d = locals[cdt][cdn];
		if(cur_frm.doc.quotation_sales_person.length > 0){
			$.each(cur_frm.doc.quotation_sales_person,function(i,j){
				if(j['sp_id'] == d.item_code+"-"+d.idx){
					console.log(j['sales_person'],i)
					cur_frm.doc.quotation_sales_person[i]['commission'] = (d.rate*d.qty)*flt(j['commission_rate'])/100
					cur_frm.doc.quotation_sales_person[i]['item_qty'] = d.qty
				}
			})
			refresh_field("quotation_sales_person")
		}
	}
});

add_sales_team = function(d){
	frappe.call({
		method:"frappe.client.get_list",
		args:{
			doctype:"Item Sales Person",
			filters: [
				["parent","=", d.item_code]
			],
			fields: ["sales_person","commission_rate"]
		},
		callback: function(r) {
			if (r.message) {
				console.log(r.message)
				$.each(r.message, function(i, j) {
					var row = frappe.model.add_child(cur_frm.doc,'Sales Order Sales Person', 'quotation_sales_person');
					row.item_code = d.item_code
					row.commission_rate = j['commission_rate']
					row.sales_person = j['sales_person']
					row.commission = (d.rate*d.qty)*flt(j['commission_rate'])/100
					row.sp_id = d.item_code+"-"+d.idx
					row.item_qty = d.qty
					refresh_field("quotation_sales_person");
				});	
			}
		}
	});
}