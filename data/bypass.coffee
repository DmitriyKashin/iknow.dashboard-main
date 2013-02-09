type = require './types'
bypass = (super_obj, obj, data, type, property, opt_data) ->
	#super_obj - главный объект, obj - подобъект, data - данные для coeffH, coeffM и predict, type, property - путь до числового значения (pin.list.popular, например), opt_data - данные для predict и plus
	path = ""
	if !obj.hasOwnProperty("pin") and !obj.hasOwnProperty("show") and !obj.hasOwnProperty("popular") and !obj.hasOwnProperty("fb")
		[object_type, event_type, event_subtype] = property.split '.'
		#Для заполнения массивов
		if type is "push"
			if event_type is undefined
				super_obj[object_type].push data[object_type]
			else if event_subtype is undefined
				(super_obj[object_type])[event_type].push (data[object_type])[event_type]
			else
				((super_obj[object_type])[event_type])[event_subtype].push ((data[object_type])[event_type])[event_subtype]
		if type is "coeffH"
			if event_type isnt undefined
				if event_subtype is undefined
					data.summ_y = 0
					data.summ_xy = 0
					for i in [0..(data.len-1)]
						data.summ_y += ((data.outSetH[object_type])[event_type])[i]
						data.summ_xy += ((data.outSetH.DateTime[i]).getHours())*(((data.outSetH[object_type])[event_type])[i])
					data.det = (data.summ_x_2*data.len)-(data.summ_x*data.summ_x)
					(data.outA0H[object_type])[event_type] = (1/data.det)*data.summ_y*data.summ_x_2 + (1/data.det)*data.summ_x*data.summ_xy
					(data.outA1H[object_type])[event_type] = (1/data.det)*data.summ_x*data.summ_y + (1/data.det)*data.len*data.summ_xy
				else
					data.summ_y = 0
					data.summ_xy = 0
					for i in [0..(data.len-1)]
						data.summ_y += (((data.outSetH[object_type])[event_type])[event_subtype])[i]
						data.summ_xy += ((data.outSetH.DateTime[i]).getHours())*((((data.outSetH[object_type])[event_type])[event_subtype])[i])
					data.det = (data.summ_x_2*data.len)-(data.summ_x*data.summ_x)
					((data.outA0H[object_type])[event_type])[event_subtype] = (1/data.det)*data.summ_y*data.summ_x_2 + (1/data.det)*data.summ_x*data.summ_xy
					((data.outA1H[object_type])[event_type])[event_subtype] = (1/data.det)*data.summ_x*data.summ_y + (1/data.det)*data.len*data.summ_xy
		if type is "coeffM"
			if event_type isnt undefined
				if object_type isnt undefined
					if event_subtype is undefined
						data.summ_y = 0
						data.summ_xy = 0
						for i in [0..(data.len-1)]
							data.summ_y += ((data.outSet[object_type])[event_type])[i]
							data.summ_xy += ((data.outSet.DateTime[i]).getMinutes())*(((data.outSet[object_type])[event_type])[i])
						data.det = (data.summ_x_2*data.len)-(data.summ_x*data.summ_x)
						(data.outA0[object_type])[event_type] = (1/data.det)*data.summ_y*data.summ_x_2 + (1/data.det)*data.summ_x*data.summ_xy
						(data.outA1[object_type])[event_type] = (1/data.det)*data.summ_x*data.summ_y + (1/data.det)*data.len*data.summ_xy
					else
						data.summ_y = 0
						data.summ_xy = 0
						for i in [0..(data.len-1)]
							data.summ_y += (((data.outSet[object_type])[event_type])[event_subtype])[i]
							data.summ_xy += ((data.outSet.DateTime[i]).getMinutes())*((((data.outSet[object_type])[event_type])[event_subtype])[i])
						data.det = (data.summ_x_2*data.len)-(data.summ_x*data.summ_x)
						((data.outA0[object_type])[event_type])[event_subtype] = (1/data.det)*data.summ_y*data.summ_x_2 + (1/data.det)*data.summ_x*data.summ_xy
						((data.outA1[object_type])[event_type])[event_subtype] = (1/data.det)*data.summ_x*data.summ_y + (1/data.det)*data.len*data.summ_xy
		if type is "predict"
			if event_type isnt undefined
				if event_subtype is undefined
					for i in [0..6]
						pred_elem = ((data.outA0H[object_type])[event_type]) + ((super_obj.DateTime[i]).getHours() * ((data.outA1H[object_type])[event_type]))
						(((opt_data[object_type])[event_type])).push (pred_elem/10).toFixed(2)
					for i in [7..66]
						pred_elem = ((data.outA0[object_type])[event_type]) + ((super_obj.DateTime[i]).getMinutes() * ((data.outA1[object_type])[event_type]))
						(((opt_data[object_type])[event_type])).push (pred_elem/10).toFixed(2)	
				else
					for i in [0..6]
						pred_elem = ((data.outA0H[object_type])[event_type])[event_subtype] + ((super_obj.DateTime[i]).getHours() * ((data.outA1H[object_type])[event_type])[event_subtype])
						(((opt_data[object_type])[event_type])[event_subtype]).push (pred_elem/10).toFixed(2)
					for i in [7..66]
						pred_elem = ((data.outA0[object_type])[event_type])[event_subtype] + ((super_obj.DateTime[i]).getMinutes() * ((data.outA1[object_type])[event_type])[event_subtype])
						(((opt_data[object_type])[event_type])[event_subtype]).push (pred_elem/10).toFixed(2)
		path = ""
	else
		if property isnt null and property isnt undefined
			path+=property
			path+="."
		for prop of obj
			if prop isnt undefined
				upper_path = path+prop
				bypass(super_obj, obj[prop], data, type, upper_path, opt_data)


#Exports
exports.bypass = bypass