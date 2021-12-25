local result 		= {} 
local mapp   		= {["0"]="female", ["1"]="male", ["2"]="unisex"}
local undefined = "not found"
local incrRate 	= -1

local function getFirstAndLastName(str)
	local fields 		= {}
	local lastName  = ""
	local firstName = ""	
	for c in string.gmatch(str, "%S+") do
		table.insert(fields, c)
	end  
	local count     = #(fields)
	if count > 1 then
		return {["firstName"] = string.gsub(str, ' ' .. fields[count], ""), ["lastName"] = fields[count]}
	else 
		return {["firstName"] = fields[1], ["lastName"] = ""}
	end	
end

local function trim(str)  --	return string.gsub(string.gsub(str, "%s+", " "), "^%s*(.-)%s*$", "%1")
	return string.gsub(str, "^%s*(.-)%s*$", "%1") -- trim
end

local function capitalize(str)
	return string.gsub(str, "(%l)(%w*)", function(a,b) return string.upper(a)..b end)
end

if ARGV[2] == "full_name" then
	for k, name in pairs(KEYS) do
		local sanitized_name 		= trim(name)
		local r                 = getFirstAndLastName(sanitized_name)		
		--r["sanitized_name"] 		= capitalize(sanitized_name)
		if string.find(r["firstName"], "^abd" ) ~= nil then
			r["gender"] = "male"
		else	
			r["gender"] = mapp[redis.call("GET", r["firstName"] .. ":g")] or undefined
		end
		if r["gender"] ~= undefined then
			incrRate = incrRate + 1	
		end
		r["firstName"] = capitalize(r["firstName"])
		r["lastName"]  = capitalize(r["lastName"])
		result[name] 	 = r
	end
else
	for k,name in pairs(KEYS) do
		local sanitized_name 		= trim(name)
		local r 	 							= {}
		r["sanitized_name"] 		= capitalize(sanitized_name)
		if string.find(sanitized_name, "^abd" ) ~= nil then
			r["gender"] = "male"
		else	
			r["gender"] = mapp[redis.call("GET", sanitized_name .. ":g")] or undefined
		end
		if r["gender"] ~= undefined then
			incrRate = incrRate + 1	
		end
		result[name] 	= r
	end
end
if incrRate ~= 0 then redis.call('INCRBY', 'ratelimit:' .. ARGV[1], incrRate) end
return cjson.encode(result)